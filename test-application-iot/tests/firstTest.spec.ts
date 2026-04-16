import {expect, test} from '@playwright/test'
import { zipAll } from 'rxjs-compat/operator/zipAll'

 test.beforeEach( async ({page}) =>{
    await page.goto('http://localhost:4200/')
})
    

test.describe('test suite 1', () => {
    test.beforeEach( async ({page}) =>{
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    
})

test('the second test', async ({page}) =>{
   await page.getByText('Datepicker').click()

})

test('the locator syntax', async ({page}) =>{
    //    tag name
    page.locator('input')
    //    id
    page.locator('#inputEmail1')
    //    class value
   page.locator('.shape-rectangle')
   //    attribute
   page.locator('[placeholder="Email"]')
   //    text match
   page.locator(':text("Using")')

})
   
test('user facing locators', async ({page}) =>{
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click()
    await page.getByText('Using the grid').click()
   
})

test('locating child elements', async ({page}) =>{
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 1")').click()
    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()
    await page.locator('nb-card').nth(3).getByRole('button').click()
   
})

test('locating parent elements', async ({page}) =>{
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail')}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()
    await page.locator('nb-card').filter({has: page.locator('nb-chechbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator(':text-is("Using the Grid)').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('reusing locators', async ({page}) =>{
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    
    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('xyz123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
    
})

test('extracting values', async ({page}) =>{
    // single text values
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    // all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    // input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    // value of the attribute
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
    
})

test('assertions and waits', async ({page}) =>{
    // general assertions
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
    const text = await basicFormButton.textContent
    expect(text).toEqual("Submit")

    const value = 5
    expect(value).toEqual(5)

    // locator assertion
    await expect(basicFormButton).toHaveText("Submit")

    // soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()

    // wait for methods without wait implemented

    await basicFormButton.waitFor({state: "attached"})
    const text2 = basicFormButton.allTextContents()



})



})

// test('the first test', () =>{

// })

// test('the first test', () =>{

// })

// })