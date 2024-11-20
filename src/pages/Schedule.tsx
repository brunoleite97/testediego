import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NewAppointmentForm } from '@/components/NewAppointmentForm';
import { FilterForm } from '@/components/FilterForm';
import { AppointmentList } from '@/components/AppointmentList';
import { api } from '@/lib/api';
import { Filter, SlidersHorizontal } from 'lucide-react';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [appointments, setAppointments] = useState([]);
  const [appointmentCounts, setAppointmentCounts] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
      
      // Calculate appointment counts per day
      const counts = response.data.reduce((acc, appointment) => {
        const date = format(new Date(appointment.date), 'yyyy-MM-dd');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      setAppointmentCounts(counts);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const getDayAppointments = (date: Date) => {
    return appointments.filter(
      (appointment) =>
        format(new Date(appointment.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Schedule</h1>
          <div className="space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <FilterForm onFilter={fetchAppointments} />
              </PopoverContent>
            </Popover>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  New Appointment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Appointment</DialogTitle>
                </DialogHeader>
                <NewAppointmentForm onSuccess={fetchAppointments} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              hasAppointments: (date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                return !!appointmentCounts[dateStr];
              },
            }}
            modifiersStyles={{
              hasAppointments: {
                fontWeight: 'bold',
                color: 'var(--primary)',
              },
            }}
            components={{
              DayContent: ({ date }) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const count = appointmentCounts[dateStr] || 0;
                return (
                  <div className="relative">
                    <div>{date.getDate()}</div>
                    {count > 0 && (
                      <div className="absolute bottom-0 right-0 text-xs bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
                        {count}
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        </div>

        {selectedDate && (
          <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(undefined)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  Appointments for {format(selectedDate, 'MMMM d, yyyy')}
                </DialogTitle>
              </DialogHeader>
              <AppointmentList appointments={getDayAppointments(selectedDate)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}