const { I, NavigateByUrl, NavigateByClick } = inject();

Given(/I load the (?<page>users|home) page url/, async (page) => {
    const domain = "http://localhost:3000";
    const destinationPage = ["users"].includes(page) ? page : "/";

    const url = new URL(destinationPage, domain);
    await I.loadPage(url.href);
    await I.saveScreenshot(`${page}-page.png`);

    await NavigateByUrl.goto(destinationPage);
    await I.saveScreenshot("home-page-final.png");
});

When(/I click on the (?<page>users|home) link/, async (page) => {
    await NavigateByClick.click(page, "p a", (["users"].includes(page) && page) || "/");
    // What if multiple links w/ only "p a"
    // dtids are important, otherwise have to try to evaluate href values
    // which isn't bad per se, but home type links with "/" can be complicated
});
