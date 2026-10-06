export type Community = {
  id: string;
  name: string;
  timezone: string; // IANA zone, e.g. "America/Chicago"
};

export type Resident = {
  id: string;
  name: string;
  room: string;
  status: string;
};

export type VitalsReading = {
  id: string;
  residentId: string;
  takenAt: string;
  takenBy: string;
  temperatureF?: number;
  pulse?: number;
  spo2?: number;
  systolic?: number;
  diastolic?: number;
};
