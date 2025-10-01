import { Injectable } from '@nestjs/common';
import { Battery, BatteryList, Measurement } from './types';
import * as fs from 'fs';

@Injectable()
export class AppService {
  private file = 'batteries.json';

  /**
   * This function reads the batteries from a JSON file and returns them as a BatteryList object.
   * @returns {BatteryList} - The list of batteries.
   */
  getAllBatteries(): BatteryList {
    const data = fs.readFileSync(this.file, 'utf-8');
    return JSON.parse(data) as BatteryList;
  }

  /**
   * This function creates a new battery and saves it to the JSON file.
   * @param {Battery} battery - The battery to be created.
   * @throws Will throw an error if a battery with the same ID or serial number already exists.
   */
  createBattery(battery: Battery): void {
    const data = fs.readFileSync(this.file, 'utf-8');
    const batteries = JSON.parse(data) as BatteryList;
    if (batteries.batteries.find(b => b.id === battery.id) || batteries.batteries.find(b => b.serialNumber === battery.serialNumber)) {
      throw new Error('Battery with the same ID or serial number already exists');
    }
    const newBattery = new Battery(
      battery.id,
      battery.serialNumber,
      battery.capacity,
      battery.location,
      battery.measurements,
    );
    batteries.batteries.push(newBattery);
    fs.writeFileSync(this.file, JSON.stringify(batteries, null, 2));
  }

  /**
   * This function adds a new measurement to an existing battery.
   * @param id - The ID of the battery to which the measurement will be added.
   * @param measurement - The measurement data to be added.
   * @returns The updated battery object or null if the battery was not found.
   */
  addMeasurement(id: number, measurement: Measurement): Battery | null {
    const data = fs.readFileSync(this.file, 'utf-8');
    const batteryList = JSON.parse(data) as BatteryList;
    const battery = batteryList.batteries.find(b => b.id === id);
    if (battery) {
      battery.measurements.push(measurement);
      fs.writeFileSync(this.file, JSON.stringify(batteryList, null, 2));
      return battery;
    }
    return null;
  }

  /**
   * This function retrieves all measurements for a specific battery by its ID.
   * @param id - The ID of the battery.
   * @returns An array of measurements or null if the battery was not found.
   */
  getAllMeasurements(id: number): Measurement[] | null {
    const data = fs.readFileSync(this.file, 'utf-8');
    const batteryList = JSON.parse(data) as BatteryList;
    const battery = batteryList.batteries.find(b => b.id === id);
    return battery ? battery.measurements : null;
  }
}
