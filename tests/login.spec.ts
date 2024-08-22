import {test, expect} from '@playwright/test'
import {LoginPage} from '../page-models/login-page.ts'

test.describe('Login suite',()=> {
    let loginPage : LoginPage;

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        await loginPage.goTo();
    })

    test('Login successful', async ({page}) => {
        await loginPage.login('juancamiloau@gmail.com', '123456789');
        await expect(page.getByText('LOGIN FORM')).toBeHidden();
    })

    test('Login failed by Captcha', async ({page}) => {
        await loginPage.login('juancamiloau@gmail.com', '123456789');
        await expect(page.locator('.dxeErrorCell_Metropolis')).toHaveText('The submitted code is incorrect')
    })

    test('Login failed by empty password', async ({page}) => {
        await loginPage.login('juancamiloau@gmail.com', '');
        await expect(page.locator('#HeaderControl_LogonControl_LoginFormLayout_txtPassword_CC')).toHaveCSS('outline-color','rgb(255, 0, 0)');
    })
})