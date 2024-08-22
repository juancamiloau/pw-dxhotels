import {type Locator, type Page, expect} from '@playwright/test'
import {parsePrice, parsePriceInteger} from '../utils/parse-utils'
import { SharedContext } from '../utils/shared-context';

export class HotelResultsPage{
    readonly page: Page;
    readonly firstStarCheck : Locator;
    readonly secondStartCheck : Locator;
    readonly lowPriceTrackBar : Locator;
    readonly applyButton : Locator;
    readonly nextPageButton : Locator;
    readonly itemPrices : Locator;
    readonly minPriceSelected : Locator;
    private sharedContext : SharedContext;

    constructor(page: Page, sharedContext: SharedContext){
        this.sharedContext = sharedContext;
        this.page = page;
        this.firstStarCheck = page.locator('#MainContentPlaceHolder_FilterFormLayout_OurRatingCheckBoxList_RB0_I_D');
        this.secondStartCheck = page.locator('#MainContentPlaceHolder_FilterFormLayout_OurRatingCheckBoxList_RB1_I_D');
        this.lowPriceTrackBar = page.locator('#MainContentPlaceHolder_FilterFormLayout_NightlyRateTrackBar_MD');
        this.applyButton = page.locator('span', {hasText : 'APPLY'});
        this.nextPageButton = page.getByAltText('Next');
        this.itemPrices = page.locator('.price');
        this.minPriceSelected = page.locator('#NightyRateTrackBarLabel_L');
    }


    async unselectStars(){
        await this.firstStarCheck.click();
        await this.secondStartCheck.click();
    }

    async movePriceTrackBar(price: number){
        const minValue = parsePriceInteger(await this.minPriceSelected.textContent() || "");
        const maxValue = parsePriceInteger(await this.page.locator('#NightyRateTrackBarLabel_R').textContent() || "");
        
        const trackbarHandle = this.page.locator('#MainContentPlaceHolder_FilterFormLayout_NightlyRateTrackBar_MD');
        const trackbarInput = this.page.locator('#MainContentPlaceHolder_FilterFormLayout_NightlyRateTrackBar_SD');
        const initialBoundingBox = await trackbarHandle.boundingBox();
        if (!initialBoundingBox) {
            throw new Error('No se pudo obtener la posición del handle del trackbar.');
        }

        const initialX = initialBoundingBox.x + initialBoundingBox.width / 2;
        const initialY = initialBoundingBox.y + initialBoundingBox.height / 2;

        const finalBoundingBox = await trackbarInput.boundingBox();
        if (!finalBoundingBox) {
            throw new Error('No se pudo obtener la posición del handle del trackbar.');
        }

        // Calcular la cantidad de píxeles que se deben mover por cada dólar
        const totalPixels =  finalBoundingBox.x - initialBoundingBox.x;
        const dollarsPerPixel =  Math.round((maxValue - minValue) / totalPixels);

        // Calcular la distancia que se debe mover
        const distanceToMove = (price - minValue) / dollarsPerPixel;

        // Mover el mouse al handle
        await this.page.mouse.move(initialX, initialY);
        // Hacer clic y arrastrar el handle
        await this.page.mouse.down();
        await new Promise(resolve => setTimeout(resolve, 100));
        await this.page.mouse.move(initialX + distanceToMove, initialY);
        await new Promise(resolve => setTimeout(resolve, 100));
        await this.page.mouse.up();
        await this.sharedContext.set('lowerRangePrice', await this.minPriceSelected.textContent());
    }

    async applyFilters(){
        await this.applyButton.click();
    }

    async validateLowPrices(){
        let hasNextPage = true;
        let minPrice = Number.MAX_VALUE.toString();
        let minPriceShowed = parsePrice(await this.sharedContext.get('lowerRangePrice'));
        do{
            let prices = await this.itemPrices.allInnerTexts();
            for(let price of prices){
                const priceNumber = parsePrice(price);
                if(parsePrice(minPrice)> priceNumber){
                    minPrice = price;
                }
                //expect(priceNumber).toBeGreaterThanOrEqual(minPriceShowed);
            }
            var parentNextButton = await this.nextPageButton.locator('..').getAttribute('class');
            hasNextPage = (parentNextButton?.indexOf('dxp-disabledButton') || -1) <= -1;
            
            if (hasNextPage){
                var currentPage = await this.page.locator('.dxp-current').textContent() || "";
                await this.nextPageButton.click();
                await expect(this.page.locator('.dxp-current')).toHaveText((parseInt(currentPage)+1).toString(), {timeout:3000});
            }
        }while(hasNextPage);
        await this.sharedContext.set('lowerPrice', minPrice);
        // returning to first page
        await this.page.getByAltText('First').click();
        await expect(this.page.locator('.dxp-current')).toHaveText('1', {timeout:3000});


        
    }

    async selectLowerPrice(){
        let hasNextPage = true;
        const minPrice = await this.sharedContext.get('lowerPrice');
        do{
            
            let prices = await this.itemPrices.allInnerTexts();
            
            let position = prices.indexOf(minPrice)
            if (position > -1){
                let hotelName = await this.page.getByText(minPrice).first().locator('../..').locator('a.hotel-title').textContent();
                await this.sharedContext.set('hotelName', hotelName);
                await this.page.locator(`#MainContentPlaceHolder_HotelsDataView_IT${position}_BookItButton_${position}_CD`).click();
                return;
            }
            var parentNextButton = await this.nextPageButton.locator('..').getAttribute('class');
            hasNextPage = (parentNextButton?.indexOf('dxp-disabledButton') || -1) <= -1;
            
            if (hasNextPage){
                var currentPage = await this.page.locator('.dxp-current').textContent() || "";
                await this.nextPageButton.click();
                await expect(this.page.locator('.dxp-current')).toHaveText((parseInt(currentPage)+1).toString(), {timeout:3000});
            }
        }while(hasNextPage);

        throw new Error('Could not select the lower price');
    }
}