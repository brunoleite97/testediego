import { format } from 'date-fns';

interface Appointment {
  name: string;
  service: string;
  date: string;
  time: string;
  phone: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments for this day</p>
      ) : (
        appointments.map((appointment, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Client</p>
                <p>{appointment.name}</p>
              </div>
              <div>
                <p className="font-semibold">Service</p>
                <p>{appointment.service}</p>
              </div>
              <div>
                <p className="font-semibold">Time</p>
                <p>{appointment.time}</p>
              </div>
              <div>
                <p className="font-semibold">Phone</p>
                <p>{appointment.phone}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}