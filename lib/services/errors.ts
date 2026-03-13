export class DomainError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "DomainError";
    this.code = code;
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string, identifier: string) {
    super("NOT_FOUND", `${entity} not found: ${identifier}`);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message);
    this.name = "ValidationError";
  }
}

export class TenantScopeError extends DomainError {
  constructor(entity: string, tenantId: string) {
    super("TENANT_SCOPE_ERROR", `${entity} does not belong to tenant ${tenantId}.`);
    this.name = "TenantScopeError";
  }
}
