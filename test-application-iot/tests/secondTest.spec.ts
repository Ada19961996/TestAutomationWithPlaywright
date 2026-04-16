import {expect, test} from '@playwright/test'
import { zipAll } from 'rxjs-compat/operator/zipAll'
import { delay } from 'rxjs/operators'

 test.beforeEach( async ({page}) =>{
    await page.goto('http://localhost:4200/')
})
    

test.describe('test suite 2', () => {
    test.beforeEach( async ({page}) =>{
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    
})

test('the input fields test', async ({page}) =>{
   const usingTheGridEmailInput = await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

   await usingTheGridEmailInput.fill('test@test.com')
   await usingTheGridEmailInput.clear()
   await usingTheGridEmailInput.pressSequentially('test@test.com', {delay: 500})

   const inputValue = await usingTheGridEmailInput.inputValue()
   expect(inputValue).toEqual('test@test.com')
   await expect(usingTheGridEmailInput).toHaveValue('test@test.com')

})

test('the radio buttons test', async ({page}) =>{
    const usingTheGrid = await page.locator('nb-card', {hasText: "Using the Grid"})

    // checking radio button with surpassing .visually-hidden class 
    await usingTheGrid.getByLabel('Option 1').check({force: true})
    await usingTheGrid.getByRole('radio', {name: 'Option 1'}).check({force: true})
    const radioStatus1 = await usingTheGrid.getByRole('radio', {name: 'Option 1'}).isChecked()
    
   
    expect(radioStatus1).toBeTruthy()
    await expect(usingTheGrid.getByRole('radio', {name: 'Option 1'})).toBeChecked()

//    checking if the option 2 is selected, Option 1 is unchecked
    await usingTheGrid.getByLabel('Option 2').check({force: true})
    const radioStatus2 = await usingTheGrid.getByRole('radio', {name: 'Option 2'}).isChecked()
    expect(radioStatus2).toBeTruthy()
    expect(await usingTheGrid.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
    
})



})

test.describe('test suite 2', () => {
    test.beforeEach( async ({page}) =>{
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()
    
})

test('the checkboxes test', async ({page}) =>{
    
    // await page.getByRole('checkbox', {name: 'Hide on click'}).click({force: true})
    await page.getByRole('checkbox', {name: 'Hide on click'}).check({force: true})
    await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).uncheck({force: true})
    const allCheckBoxes = page.getByRole('checkbox')

    for (const box of await allCheckBoxes.all()){
        await box.check({force: true})
        expect(await box.isChecked()).toBeTruthy()
    }
    
})


})

test('dropdown list test', async ({page}) =>{
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    // page.getByRole('list') only when list has ul
    // page.getByRole('listitem') only when list has li

    // const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Cosmic"}).click()
    const header = page.locator('nb-layout-header')
    expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)")

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropDownMenu.click()

    for (const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS("background-color", colors[color])
        if(color != "Corporate"){
            await dropDownMenu.click()
        }
    }

})

test('the tooltip test', async ({page}) =>{
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await toolTipCard.getByRole('button', {name: "Top"}).hover()

    // page.getByRole('tooltip')
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual("This is a tooltip")
    
})

