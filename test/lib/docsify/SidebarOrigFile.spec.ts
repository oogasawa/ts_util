
/**
 * @jest-environment node
 */

import SidebarOrigFile from "../../../src/lib/docsify/SidebarOrigFile";
import Section from "../../../src/lib/docsify/Section";

describe('SidebarOrig class', () => {

    describe("Initial state", () => {

        test("constructor", () => {
            const orig = new SidebarOrigFile();
            expect(orig).toBeTruthy();
        });

    });


    describe("Parsing _sidebar.org.md", () => {

        test("parseOrigFile", () => {
            const orig = new SidebarOrigFile();
            orig.origFilePath = "./test/lib/docsify/_sidebar.orig.md";
            orig.parseOrigFile();

            console.log(orig.sections);

            expect(orig.sections.length).toEqual(3);

            // expect(orig).toBeTruthy();
        });

    });



});
