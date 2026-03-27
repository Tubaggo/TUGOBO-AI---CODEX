[CmdletBinding()]
param(
    [switch]$Aggressive,
    [switch]$CloseHeavyApps
)

$ErrorActionPreference = 'Stop'

function Write-Info {
    param([string]$Message)
    Write-Host "[BILGI] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "[TAMAM] $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[UYARI] $Message" -ForegroundColor Yellow
}

function Write-Err {
    param([string]$Message)
    Write-Host "[HATA] $Message" -ForegroundColor Red
}

function Get-FreeSpaceGb {
    try {
        $drive = Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DeviceID='C:'"
        if (-not $drive) {
            throw "C: surucusu bulunamadi."
        }

        return [math]::Round(($drive.FreeSpace / 1GB), 2)
    }
    catch {
        Write-Warn "Bos alan bilgisi okunamadi: $($_.Exception.Message)"
        return $null
    }
}

function Invoke-SafeAction {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,

        [Parameter(Mandatory = $true)]
        [scriptblock]$Action,

        [switch]$ContinueOnError
    )

    try {
        & $Action
        return [pscustomobject]@{
            Name = $Name
            Status = 'Basarili'
            Detail = $null
        }
    }
    catch {
        $detail = $_.Exception.Message
        if ($ContinueOnError) {
            Write-Warn "$Name tamamlanirken sorun olustu: $detail"
            return [pscustomobject]@{
                Name = $Name
                Status = 'Uyari'
                Detail = $detail
            }
        }

        Write-Err "$Name basarisiz oldu: $detail"
        return [pscustomobject]@{
            Name = $Name
            Status = 'Basarisiz'
            Detail = $detail
        }
    }
}

function Clear-FolderContents {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,

        [string]$Label
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        Write-Warn "$Label klasoru bulunamadi: $Path"
        return
    }

    Write-Info "$Label temizleniyor: $Path"

    Get-ChildItem -LiteralPath $Path -Force -ErrorAction SilentlyContinue | ForEach-Object {
        try {
            Remove-Item -LiteralPath $_.FullName -Recurse -Force -ErrorAction Stop
        }
        catch {
            Write-Warn "Silinemeyen oge atlaniyor: $($_.FullName)"
        }
    }

    Write-Success "$Label temizleme islemi tamamlandi."
}

function Stop-ProcessesIfRunning {
    param([string[]]$Names)

    foreach ($name in $Names) {
        try {
            $processes = Get-Process -Name $name -ErrorAction SilentlyContinue
            if (-not $processes) {
                Write-Info "$name calismiyor, kapatma gerekmiyor."
                continue
            }

            $processes | Stop-Process -Force -ErrorAction Stop
            Write-Success "$name surecleri kapatildi."
        }
        catch {
            Write-Warn "$name kapatilamadi: $($_.Exception.Message)"
        }
    }
}

function Stop-ServiceIfRunning {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ServiceName,

        [Parameter(Mandatory = $true)]
        [string]$DisplayName
    )

    try {
        $service = Get-Service -Name $ServiceName -ErrorAction Stop
        if ($service.Status -ne 'Running') {
            Write-Info "$DisplayName zaten calismiyor."
            return
        }

        Stop-Service -Name $ServiceName -Force -ErrorAction Stop
        Write-Success "$DisplayName gecici olarak durduruldu."
    }
    catch {
        Write-Warn "$DisplayName durdurulamadi: $($_.Exception.Message)"
    }
}

$summary = New-Object System.Collections.Generic.List[object]

Write-Host "=== Bilgisayar Optimizasyon Araci (Guvenli Varsayilanlar) ===" -ForegroundColor White
Write-Info "Bu betik kalici degisiklik yapmaz. Defender, kayit defteri veya servis baslangic ayarlari degistirilmez."

$beforeFreeSpace = Get-FreeSpaceGb
if ($null -ne $beforeFreeSpace) {
    Write-Info "Optimizasyon oncesi C: bos alan: $beforeFreeSpace GB"
}

$summary.Add((Invoke-SafeAction -Name 'Kullanici TEMP klasoru temizligi' -ContinueOnError -Action {
    Clear-FolderContents -Path $env:TEMP -Label 'Kullanici TEMP'
}))

$summary.Add((Invoke-SafeAction -Name 'Windows Temp klasoru temizligi' -ContinueOnError -Action {
    $windowsTemp = Join-Path $env:windir 'Temp'
    if (Test-Path -LiteralPath $windowsTemp) {
        Clear-FolderContents -Path $windowsTemp -Label 'Windows Temp'
    }
    else {
        Write-Warn "Windows Temp klasorune erisilemedi veya klasor mevcut degil."
    }
}))

$summary.Add((Invoke-SafeAction -Name 'Geri Donusum Kutusu temizligi' -ContinueOnError -Action {
    Clear-RecycleBin -Force -ErrorAction Stop | Out-Null
    Write-Success 'Geri Donusum Kutusu bosaltildi.'
}))

$summary.Add((Invoke-SafeAction -Name 'DNS onbellegi temizligi' -ContinueOnError -Action {
    Write-Info 'DNS onbellegi temizleniyor...'
    $flushOutput = & ipconfig /flushdns 2>&1
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
        throw ($flushOutput | Out-String)
    }

    Write-Host ($flushOutput | Out-String).Trim()
    Write-Success 'DNS onbellegi temizlendi.'
}))

if ($CloseHeavyApps) {
    $summary.Add((Invoke-SafeAction -Name 'Agir uygulamalari kapatma' -ContinueOnError -Action {
        Write-Info 'Chrome, Microsoft Edge ve Antigravity surecleri kontrol ediliyor...'
        Stop-ProcessesIfRunning -Names @('chrome', 'msedge', 'Antigravity')
    }))
}
else {
    Write-Info 'Agir uygulamalari kapatma secenegi kullanilmadi.'
}

if ($Aggressive) {
    Write-Warn 'Agresif kip etkin. Bu adimlar gecicidir ve arama tepkiselligini azaltabilir.'
    $summary.Add((Invoke-SafeAction -Name 'Windows Search servis islemi' -ContinueOnError -Action {
        Stop-ServiceIfRunning -ServiceName 'WSearch' -DisplayName 'Windows Search'
    }))
    $summary.Add((Invoke-SafeAction -Name 'SysMain servis islemi' -ContinueOnError -Action {
        Stop-ServiceIfRunning -ServiceName 'SysMain' -DisplayName 'SysMain'
    }))
}
else {
    Write-Info 'Agresif kip kullanilmadi; servisler calisma durumunda birakildi.'
}

$afterFreeSpace = Get-FreeSpaceGb
if ($null -ne $afterFreeSpace) {
    Write-Info "Optimizasyon sonrasi C: bos alan: $afterFreeSpace GB"
}

Write-Host ''
Write-Host '=== Ozet ===' -ForegroundColor White
foreach ($item in $summary) {
    $detailText = if ($item.Detail) { " - $($item.Detail)" } else { '' }
    Write-Host ("- {0}: {1}{2}" -f $item.Name, $item.Status, $detailText)
}

if (($null -ne $beforeFreeSpace) -and ($null -ne $afterFreeSpace)) {
    $difference = [math]::Round(($afterFreeSpace - $beforeFreeSpace), 2)
    Write-Host ("- C: bos alan degisimi: {0} GB" -f $difference)
}

Write-Host ''
Write-Success 'Islem tamamlandi.'
