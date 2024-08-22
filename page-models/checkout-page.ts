import {type Page, type Locator} from '@playwright/test'
import { SharedContext } from '../utils/shared-context'

export class CheckoutPage{
    readonly page: Page;
    private sharedContext : SharedContext;
    readonly hotelNameSummary: Locator;
    readonly checkInDate : Locator;
    readonly checkOutDate: Locator;
    readonly totalPrice: Locator;

    constructor(page: Page, sharedContext: SharedContext){
        this.sharedContext = sharedContext;
        this.page = page;
        this.hotelNameSummary = this.page.locator('//img[@id="MainContentPlaceHolder_HotelImage"]/following-sibling::h5');
        this.checkInDate = this.page.getByText('Check in').locator('span.date');
        this.checkOutDate = this.page.getByText('Check out').locator('span.date');
        this.totalPrice = this.page.locator('tr.price-result').locator('td.price');
    }

    async getHotelNameInSummary(){
        return await this.hotelNameSummary.textContent();
    }

    async getCheckInDate(){
        return await this.checkInDate.textContent();
    }

    async getCheckOutDate(){
        return await this.checkOutDate.textContent();
    }
}