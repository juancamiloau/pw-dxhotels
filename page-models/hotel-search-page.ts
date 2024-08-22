import {type Page, type Locator} from '@playwright/test'

export class HotelSearchPage{
    readonly page : Page;
    readonly locationDropDown : Locator;
    readonly checkInDatePicker: Locator;
    readonly checkoutDatePicker : Locator;
    readonly roomsDropDown : Locator;
    readonly adultsSpin : Locator;
    readonly childrenSpin : Locator;
    readonly searchButton : Locator;

    constructor(page :Page){
        this.page = page;
        this.locationDropDown = page.getByLabel('Location');
        this.checkInDatePicker = page.locator('#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_CheckInDateEdit_B-1Img');
        this.checkoutDatePicker = page.locator('#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_CheckOutDateEdit_B-1Img');
        this.roomsDropDown = page.getByLabel('Rooms');
        this.adultsSpin = page.getByLabel('Adults');
        this.childrenSpin = page.getByLabel('Children');
        this.searchButton = page.locator('span',{hasText:'SEARCH'});
    }

    async searchHotels(location: string){
        await this.locationDropDown.pressSequentially(location, {delay:500});
        await this.page.getByText(location).click();
    }

    async selectDate(locator: Locator, date: Date){
        await locator.click({timeout: 5000});
        const fullMonth = date.toLocaleDateString('en-GB',{ month: 'long' });
        const shortMonth = date.toLocaleDateString('en-GB',{ month: 'short' });
        const year = date.getFullYear().toString();
        const day = date.getDate().toString();
        const visibleCalendar = this.page.locator('.dxpcDropDown_Metropolis[style*="visibility: visible;"]');
        const currentMonthYear = visibleCalendar.locator('.dxeCalendarHeader_Metropolis').locator('span').first();
        const currentMonthYearString = await currentMonthYear.textContent();
        if (currentMonthYearString != `${fullMonth} ${year}`)
        {
            await currentMonthYear.click();
            if (await currentMonthYear.textContent() != year)
            {
                await currentMonthYear.click();
                await this.page.getByText(year).click();
            }
            await this.page.getByText(shortMonth, {exact : true}).first().click(); 
        }
            await visibleCalendar.locator('td.dxeCalendarDay_Metropolis:not(.dxeCalendarOutOfRange_Metropolis)').filter( {hasText: day}).first().click();
    }

    async selectRooms(rooms: number){
       await this.roomsDropDown.fill(rooms.toString());
    }
    async selectAdults(adults: number){
       await this.adultsSpin.fill(adults.toString());
    }
    async selectChilds(childs: number){
       await this.childrenSpin.fill(childs.toString());
    }

    async clickOnSearch(){
        await this.searchButton.click({force:true});
    }
}