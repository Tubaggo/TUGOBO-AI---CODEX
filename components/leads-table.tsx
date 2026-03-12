import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { reservationLeads } from "@/lib/demo-data";

export function LeadsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservation leads</CardTitle>
        <CardDescription>Captured requests generated from Tugobo AI conversations</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-muted-foreground">
            <tr className="border-b">
              <th className="pb-4 pr-4 font-medium">Name</th>
              <th className="pb-4 pr-4 font-medium">Dates</th>
              <th className="pb-4 pr-4 font-medium">Guests</th>
              <th className="pb-4 pr-4 font-medium">Channel</th>
              <th className="pb-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservationLeads.map((lead) => (
              <tr key={lead.id} className="border-b last:border-b-0">
                <td className="py-4 pr-4 font-medium">{lead.guestName}</td>
                <td className="py-4 pr-4">
                  {lead.checkIn} to {lead.checkOut}
                </td>
                <td className="py-4 pr-4">{lead.guests}</td>
                <td className="py-4 pr-4">{lead.channel}</td>
                <td className="py-4">
                  <Badge variant={lead.status === "new" ? "warning" : lead.status === "qualified" ? "default" : "success"}>
                    {lead.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
