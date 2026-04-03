import type { ChannelType } from "../../lib/domain/types";
import { getCrmI18n } from "../../lib/crm-translations";

const channelStyles: Record<ChannelType, string> = {
  whatsapp: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  instagram: "bg-rose-50 text-rose-700 ring-rose-200",
  webchat: "bg-sky-50 text-sky-700 ring-sky-200",
};

export function ChannelBadge({ channel }: { channel: ChannelType }) {
  const { formatChannel } = getCrmI18n();

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ring-1 ${channelStyles[channel]}`}>
      {formatChannel(channel)}
    </span>
  );
}
