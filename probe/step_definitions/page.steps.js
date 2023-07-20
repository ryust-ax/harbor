const { I } = inject();

Given("I see the users link", async () => {
    await I.seeElement("p a");
    await I.see("Users", "p a");
    const link = await I.grabAttributeFrom("p a", "href");
    await I.seeEquals(`${link.includes("users")}`, "true", "Evaluate hyperlink href (cast to string)");
});

Then(/I see the (?<page>users|home) page/, async (page) => {
    const here = await I.grabCurrentUrl();
    let intended = false;
    if (["page"].includes(page) || here.includes(page)) {
        intended = true;
    }
    if (["home"].includes(page) || ["page"].every((item) => !here.includes(item))) {
        intended = true;
    }

    await I.seeEquals(`${intended}`, "true", `Evaluate current url [${here}] is expected [${page}] (cast to string)`);
});

Given("I see the home link", async () => {
    await I.seeElement("p a");
    await I.see("Home", "p a");
    const link = await I.grabAttributeFrom("p a", "href");
    await I.seeEquals(`${!link.includes("users")}`, "true", "Evaluate hyperlink href (cast to string)");
});



