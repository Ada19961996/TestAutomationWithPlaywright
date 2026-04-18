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

test('the dialog boxes test', async ({page}) =>{
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog =>{
        expect(dialog.message()).toEqual("Are you sure yo want to delete?")
        dialog.accept()
    })

    await page.getByRole("table").locator("tr", {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
    await expect(page.locator("table tr").first()).not.toHaveText('mdo@gmail.com')
})

test('the web tables test', async ({page}) =>{
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    const targetRow = page.getByRole("row", {name: 'snow@gmail.com'})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder("Age").clear()
    await page.locator('input-editor').getByPlaceholder("Age").fill("35")
    await page.locator(".nb-checkmark").click()

    // get row based on value in specific column
    
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole("row", {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder("Age").clear()
    await page.locator('input-editor').getByPlaceholder("Age").fill("35")
    await page.locator(".nb-checkmark").click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('mark@gmail.com')

    // filter data in table
    const ages = ["20", "30", "40", "200"]

    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')
        

        for(let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent()
            
            if(age == "200"){
                expect(page.getByRole("table")).toContainText("No data found")
                
            }else(
                expect(cellValue).toEqual(age)
            )
        }

    }

})

test('the datepicker test', async ({page}) =>{
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() +1)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString("En-US", {month: 'short'})
    const expectedMonthLong = date.toLocaleString("En-US", {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`

    while(!calendarMonthAndYear?.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)

})


