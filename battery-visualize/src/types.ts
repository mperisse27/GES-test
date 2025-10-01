export class BatteryList {
  batteries: Battery[];

  constructor(batteries?: Battery[]) {
    this.batteries = batteries ?? [];
  }
}

export class Battery {
  id: number;
  serialNumber: string;
  capacity: number;
  location: string;
  measurements: Measurement[];

  constructor(
    id: number,
    serialNumber: string,
    capacity: number,
    location: string,
    measurements?: Measurement[],
  ) {
    this.id = id;
    this.serialNumber = serialNumber;
    this.capacity = capacity;
    this.location = location;
    this.measurements = measurements ?? [];
  }
}

export class Measurement {
  timestamp: Date;
  chargeLevel: number;
  temperature: number;

  constructor(timestamp: string, chargeLevel: number, temperature: number) {
    this.timestamp = new Date(timestamp);
    this.chargeLevel = chargeLevel;
    this.temperature = temperature;
  }
}