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
}

export class Measurement {
  timestamp: Date;
  chargeLevel: number;
  temperature: number;
}