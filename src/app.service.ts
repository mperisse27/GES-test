import { Injectable } from '@nestjs/common';
import { BatteryList } from './types';
import * as fs from 'fs';

@Injectable()
export class AppService {
  private file = 'batteries.json';

  getHello(): string {
    return 'Hello World!';
  }

  getAllBatteries(): BatteryList {
    const data = fs.readFileSync(this.file, 'utf-8');
    return JSON.parse(data) as BatteryList;
  }
}
