import {type Page, type Locator} from '@playwright/test'


export class LoginPage {
    readonly page : Page;
    readonly loginMenuButton: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitLoginButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.loginMenuButton = page.locator('#HeaderControl_Login_CD').locator('span', {hasText: 'Login'})
        this.emailInput = page.locator('#HeaderControl_LogonControl_LoginFormLayout_txtEmail_I');
        this.passwordInput = page.locator('#HeaderControl_LogonControl_LoginFormLayout_txtPassword_I_CLND');
        this.submitLoginButton = page.locator('#HeaderControl_LogonControl_btnLoginNow_CD').locator('span', {hasText: 'Login'})
    }

    async goTo(){
        await this.page.goto('https://demos.devexpress.com/rwa/dxhotels/');
    }

    async login(email: string, password: string) {
        await this.loginMenuButton.click();
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        
        await this.page.waitForFunction(() => {
            const input = document.querySelector('#HeaderControl_LogonControl_LoginFormLayout_Captcha_TB_I');
            return input.value.length === 5;
          });
        await this.submitLoginButton.click();
    }
}