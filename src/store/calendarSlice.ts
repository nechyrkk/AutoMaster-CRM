import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarAppointment } from '@/types';
import { mockCalendarAppointments } from '@/data/mockData';

interface CalendarState {
  appointments: CalendarAppointment[];
  selectedDate: string;
  isLoading: boolean;
}

const initialState: CalendarState = {
  appointments: mockCalendarAppointments,
  selectedDate: new Date().toISOString(),
  isLoading: false,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    addAppointment: (state, action: PayloadAction<CalendarAppointment>) => {
      state.appointments.push(action.payload);
      state.appointments.sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    },
    updateAppointment: (state, action: PayloadAction<CalendarAppointment>) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
        state.appointments.sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      }
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(a => a.id !== action.payload);
    },
    moveAppointment: (state, action: PayloadAction<{ id: string; newStartTime: string }>) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        const appointment = state.appointments[index];
        const oldStart = new Date(appointment.startTime);
        const oldEnd = new Date(appointment.endTime);
        const duration = oldEnd.getTime() - oldStart.getTime();
        
        const newStart = new Date(action.payload.newStartTime);
        const newEnd = new Date(newStart.getTime() + duration);
        
        state.appointments[index] = {
          ...appointment,
          startTime: newStart.toISOString(),
          endTime: newEnd.toISOString(),
        };
        
        state.appointments.sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setSelectedDate,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  moveAppointment,
  setLoading,
} = calendarSlice.actions;

export default calendarSlice.reducer;
