import {test, expect} from '@playwright/test'
import { LoginPage } from '../page-models/login-page'
import { HotelSearchPage } from '../page-models/hotel-search-page';
import { addDaysToProvidedDate } from '../utils/date-utils';
import { HotelResultsPage } from '../page-models/hotel-results-page';
import { SharedContext } from '../utils/shared-context';
import { CheckoutPage } from '../page-models/checkout-page';
import {formatDateToMMMDDYYYY as formatDate } from '../utils/date-utils'


test.describe('Hotel reservation suite', ()=>{
    let loginPage : LoginPage;
    let hotelSearchPage : HotelSearchPage;
    let hotelResultsPage : HotelResultsPage;
    let sharedContext : SharedContext;
    let checkoutPage : CheckoutPage;

    test.beforeEach( async ({page}) => {
        sharedContext = new SharedContext();
        loginPage = new LoginPage(page);
        hotelSearchPage = new HotelSearchPage(page);
        hotelResultsPage = new HotelResultsPage(page, sharedContext);
        checkoutPage = new CheckoutPage(page, sharedContext);
        await loginPage.goTo();
    })
    test('Reserve hotel', async ({page}) => {
        await hotelSearchPage.searchHotels('Honolulu');
        let checkInDate = addDaysToProvidedDate(new Date(), 2);
        await hotelSearchPage.selectDate(hotelSearchPage.checkInDatePicker, checkInDate);
        let checkOutDate = addDaysToProvidedDate(new Date(), 7);
        await hotelSearchPage.selectDate(hotelSearchPage.checkoutDatePicker, checkOutDate);
        await hotelSearchPage.selectRooms(2);
        await hotelSearchPage.selectAdults(3);
        await hotelSearchPage.selectChilds(2);
        await hotelSearchPage.clickOnSearch();
        await hotelResultsPage.movePriceTrackBar(200);
        await hotelResultsPage.unselectStars();
        await hotelResultsPage.applyFilters();
        await hotelResultsPage.validateLowPrices();
        await hotelResultsPage.selectLowerPrice();
        expect(await checkoutPage.getHotelNameInSummary()).toEqual(await sharedContext.get('hotelName'));
        expect(formatDate(checkInDate)).toEqual(await checkoutPage.getCheckInDate());
        expect(formatDate(checkOutDate)).toEqual(await checkoutPage.getCheckOutDate());
    })
})