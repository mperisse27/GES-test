import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Battery, BatteryList, Measurement } from './types';
import { ApiKeyGuard } from './auth.guard';

@Controller()
@UseGuards(ApiKeyGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("batteries")
  getAllBatteries(): BatteryList {
    return this.appService.getAllBatteries();
  }

  @Post("createBattery")
  createBattery(@Body() battery: Battery) {
    try {
      this.appService.createBattery(battery);
      return { message: 'Battery created successfully' };
    } catch (error) {
      throw new BadRequestException(`Failed to create battery: ${error.message}`);
    }
  }

  @Put("addMeasurement/:id")
  addMeasurement(@Param("id") id: number, @Body() measurement: Measurement): Battery | null {
    const battery = this.appService.addMeasurement(Number(id), measurement);
    if (!battery) {
      throw new NotFoundException(`Battery with id ${id} not found`);
    }
    return battery;
  }

  @Get("measurements/:id")
  getAllMeasurements(@Param("id") id: number): Measurement[] | null {
    const measurements = this.appService.getAllMeasurements(Number(id));
    if (measurements === null) {
      throw new NotFoundException(`Battery with id ${id} not found`);
    }
    return measurements;
  }
}
