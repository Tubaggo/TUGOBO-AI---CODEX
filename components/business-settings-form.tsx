import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { demoBusiness } from "@/lib/demo-data";

export function BusinessSettingsForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business settings</CardTitle>
        <CardDescription>
          A simple admin view for hotel operators to adjust the assistant's business context.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Input value={demoBusiness.businessName} readOnly />
          <Input value={demoBusiness.propertyType} readOnly />
          <Input value={demoBusiness.city} readOnly />
          <Input value={demoBusiness.country} readOnly />
          <Input value={demoBusiness.contactNumber} readOnly />
          <Input value={demoBusiness.responseLanguage} readOnly />
          <Input value={demoBusiness.checkInWindow} readOnly />
          <Input value={demoBusiness.checkOutWindow} readOnly />
        </div>

        <Input value={demoBusiness.tone} readOnly />

        <div className="rounded-[1.25rem] border bg-muted/40 p-4">
          <p className="text-sm font-medium text-slate-900">Room types</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {demoBusiness.roomTypes.map((roomType) => (
              <span key={roomType} className="rounded-full border bg-white px-3 py-1 text-sm text-slate-700">
                {roomType}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[1.25rem] border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
          <p className="font-medium text-slate-900">Policies</p>
          <div className="mt-3 space-y-2">
            {demoBusiness.policies.map((policy) => (
              <p key={policy}>{policy}</p>
            ))}
          </div>
        </div>

        <Button className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" />
          Save settings
        </Button>
      </CardContent>
    </Card>
  );
}
