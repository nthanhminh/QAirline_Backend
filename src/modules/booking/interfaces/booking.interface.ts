import { BaseRepositoryInterface } from "@repositories/base/base.interface.repository";
import { Booking } from "../entity/booking.entity";

export type BookingRepositoryInterface = BaseRepositoryInterface<Booking>;