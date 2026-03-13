import type { AssistantConfig } from "../domain";
import type {
  AssistantConfigRepository,
  ServiceContext,
  UpsertAssistantConfigInput,
} from "./contracts";
import { ValidationError } from "./errors";
import { getNow } from "./service-helpers";

const DEFAULT_SUPPORTED_LANGUAGES = ["tr", "en"];

export class AssistantConfigService {
  constructor(private readonly configs: AssistantConfigRepository) {}

  async getForTenant(context: ServiceContext): Promise<AssistantConfig | null> {
    return this.configs.getByTenantId(context.tenantId);
  }

  async upsert(context: ServiceContext, input: UpsertAssistantConfigInput): Promise<AssistantConfig> {
    if (!input.tone.trim()) {
      throw new ValidationError("tone is required.");
    }

    const supportedLanguages =
      input.supportedLanguages && input.supportedLanguages.length > 0
        ? [...new Set(input.supportedLanguages)]
        : DEFAULT_SUPPORTED_LANGUAGES;

    return this.configs.upsert(context.tenantId, {
      ...input,
      supportedLanguages,
      responseStyle: input.responseStyle ?? "balanced",
      collectPhone: input.collectPhone ?? true,
      collectEmail: input.collectEmail ?? true,
      collectDates: input.collectDates ?? true,
      now: getNow(context.now),
    });
  }

  async enableAfterHoursFallback(context: ServiceContext, fallbackMessage: string) {
    const existing = await this.getForTenant(context);

    return this.upsert(context, {
      tone: existing?.tone ?? "professional, friendly, concise",
      welcomeMessage: existing?.welcomeMessage ?? null,
      fallbackMessage,
      supportedLanguages: existing?.supportedLanguages ?? DEFAULT_SUPPORTED_LANGUAGES,
      handoffRules: existing?.handoffRules ?? null,
      businessHours: existing?.businessHours ?? null,
      responseStyle: existing?.responseStyle ?? "balanced",
      collectPhone: existing?.collectPhone ?? true,
      collectEmail: existing?.collectEmail ?? true,
      collectDates: existing?.collectDates ?? true,
    });
  }
}
