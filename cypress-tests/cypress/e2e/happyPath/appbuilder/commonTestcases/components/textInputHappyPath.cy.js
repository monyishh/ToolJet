import { fake } from "Fixtures/fake";
import { commonSelectors, commonWidgetSelector } from "Selectors/common";
import {
  addDefaultEventHandler,
  checkPaddingOfContainer,
  closeAccordions,
  editAndVerifyWidgetName,
  openAccordion,
  openEditorSidebar,
  randomNumber,
  selectColourFromColourPicker,
  verifyAndModifyParameter,
  verifyBoxShadowCss,
  verifyComponentValueFromInspector,
  verifyContainerElements,
  verifyLayout,
  verifyStylesGeneralAccordion,
  verifyTooltip,
  verifyWidgetColorCss,
} from "Support/utils/commonWidget";
import {
  addAllInputFieldColors,
  addAndVerifyAdditionalActions,
  addCustomWidthOfLabel,
  addValidations,
  verifyAlignment,
  verifyCustomWidthOfLabel,
  verifyInputFieldColors,
  verifyLabelStyleElements,
} from "Support/utils/editor/inputFieldUtils";
import {
  addCSA,
  randomString,
  verifyCSA,
} from "Support/utils/editor/textInput";
import { commonWidgetText } from "Texts/common";
import { textInputText } from "Texts/textInput";

describe("Text Input", () => {
  beforeEach(() => {
    cy.apiLogin();
    cy.apiCreateApp(`${fake.companyName}-Textinput-App`);
    cy.openApp();
    cy.dragAndDropWidget("Text Input", 500, 500);
  });
  afterEach(() => {
    cy.apiDeleteApp();
  });

  it("should verify the properties of the text input widget", () => {
    const data = {};
    data.widgetName = fake.widgetName;
    data.tooltipText = fake.randomSentence;
    data.minimumLength = randomNumber(1, 4);
    data.maximumLength = randomNumber(8, 10);
    data.customText = randomString(12);

    openEditorSidebar(textInputText.defaultWidgetName);
    closeAccordions([
      "Data",
      "Validation",
      "Additional Actions",
      "Devices",
      "Events",
    ]);
    editAndVerifyWidgetName(data.widgetName, [
      "Data",
      "Validation",
      "Additional Actions",
      "Devices",
      "Events",
    ]);
    openAccordion("Data", [
      "Data",
      "Validation",
      "Additional Actions",
      "Devices",
      "Events",
    ]);
    verifyAndModifyParameter(
      commonWidgetText.labelDefaultValue,
      data.customText
    );
    cy.forceClickOnCanvas();
    cy.get(
      commonWidgetSelector.draggableWidget(data.widgetName)
    ).verifyVisibleElement("have.value", data.customText);

    verifyComponentValueFromInspector(data.widgetName, data.customText);
    cy.forceClickOnCanvas();
    cy.get(commonWidgetSelector.draggableWidget(data.widgetName)).clear();

    data.customText = fake.randomSentence;
    openEditorSidebar(data.widgetName);
    openAccordion("Data", [
      "Data",
      "Validation",
      "Additional Actions",
      "Devices",
      "Events",
    ]);
    verifyAndModifyParameter(
      commonWidgetText.labelPlaceHolder,
      data.customText
    );
    cy.forceClickOnCanvas();
    cy.get(commonWidgetSelector.draggableWidget(data.widgetName))
      .invoke("attr", "placeholder")
      .should("contain", data.customText);

    openEditorSidebar(data.widgetName);
    openAccordion(commonWidgetText.accordionEvents, ["Validation", "Devices"]);
    addDefaultEventHandler(data.customText);
    cy.wait(1000);
    cy.get(commonWidgetSelector.eventSelection).type("On Enter Pressed{Enter}");
    cy.wait("@events");

    cy.clearAndType(
      commonWidgetSelector.draggableWidget(data.widgetName),
      `${data.customText}{Enter}`
    );
    cy.verifyToastMessage(commonSelectors.toastMessage, data.customText);
    cy.forceClickOnCanvas();

    cy.get(commonWidgetSelector.draggableWidget(data.widgetName)).clear();

    addValidations(data.widgetName, data);

    cy.clearAndType(
      commonWidgetSelector.draggableWidget(data.widgetName),
      data.customText
    );
    cy.forceClickOnCanvas();
    cy.get(
      commonWidgetSelector.validationFeedbackMessage(data.widgetName)
    ).verifyVisibleElement("have.text", commonWidgetText.regexValidationError);

    cy.get(commonWidgetSelector.draggableWidget(data.widgetName)).clear();
    cy.get(
      commonWidgetSelector.parameterInputField(commonWidgetText.labelRegex)
    ).clearCodeMirror();

    cy.forceClickOnCanvas();
    cy.get(
      commonWidgetSelector.validationFeedbackMessage(data.widgetName)
    ).verifyVisibleElement(
      "have.text",
      commonWidgetText.minLengthValidationError(data.minimumLength)
    );

    cy.get(commonWidgetSelector.draggableWidget(data.widgetName)).clear();
    cy.get(
      commonWidgetSelector.parameterInputField(commonWidgetText.labelMinLength)
    ).clearAndTypeOnCodeMirror("0");
    cy.forceClickOnCanvas();
    cy.clearAndType(
      commonWidgetSelector.draggableWidget(data.widgetName),
      data.customText.toUpperCase().replaceAll(" ", "").replaceAll(".", "")
    );
    cy.get(
      commonWidgetSelector.validationFeedbackMessage(data.widgetName)
    ).verifyVisibleElement(
      "have.text",
      commonWidgetText.maxLengthValidationError(data.maximumLength)
    );
    cy.forceClickOnCanvas();
    cy.get(commonWidgetSelector.draggableWidget(data.widgetName)).clear();
    cy.get(
      commonWidgetSelector.validationFeedbackMessage(data.widgetName)
    ).verifyVisibleElement("have.text", data.customText);
    cy.forceClickOnCanvas();
    openEditorSidebar(data.widgetName);
    cy.get(
      commonWidgetSelector.accordion(commonWidgetText.accordionValidation)
    ).click();
    addAndVerifyAdditionalActions(data.widgetName, data.tooltipText);

    openEditorSidebar(data.widgetName);
    cy.get(
      commonWidgetSelector.accordion(commonWidgetText.accordionValidation)
    ).click();
    verifyLayout(data.widgetName, "Devices");

    cy.get(commonWidgetSelector.changeLayoutToDesktopButton).click();
    cy.get(
      commonWidgetSelector.parameterTogglebutton(
        commonWidgetText.parameterShowOnDesktop
      )
    ).click();

    openEditorSidebar(data.widgetName);
    openAccordion("Validation", [
      "Data",
      "Validation",
      "Additional Actions",
      "Devices",
      "Events",
    ]);
    cy.get(
      commonWidgetSelector.parameterInputField(commonWidgetText.labelMinLength)
    ).clearAndTypeOnCodeMirror("5");
    cy.forceClickOnCanvas();
    cy.waitForAutoSave();
    openEditorSidebar(data.widgetName);

    cy.get(commonWidgetSelector.widgetDocumentationLink).should(
      "have.text",
      textInputText.textInputDocumentationLink
    );

    cy.openInCurrentTab(commonWidgetSelector.previewButton);

    cy.get(commonWidgetSelector.draggableWidget(data.widgetName))
      .invoke("attr", "placeholder")
      .should("contain", data.customText);

    cy.clearAndType(
      commonWidgetSelector.draggableWidget(data.widgetName),
      `${data.customText}{Enter}`
    );
    cy.verifyToastMessage(commonSelectors.toastMessage, data.customText);
    cy.forceClickOnCanvas();

    cy.get(commonWidgetSelector.draggableWidget(data.widgetName)).clear();

    cy.clearAndType(
      commonWidgetSelector.draggableWidget(data.widgetName),
      data.customText
    );
    cy.forceClickOnCanvas();
    // cy.get(
    //   commonWidgetSelector.validationFeedbackMessage(data.widgetName)
    // ).verifyVisibleElement("have.text", commonWidgetText.regexValidationError);

    cy.get(commonWidgetSelector.draggableWidget(data.widgetName)).clear();

    cy.forceClickOnCanvas();
    cy.get(
      commonWidgetSelector.validationFeedbackMessage(data.widgetName)
    ).verifyVisibleElement(
      "have.text",
      commonWidgetText.minLengthValidationError("5")
    );
    cy.clearAndType(
      commonWidgetSelector.draggableWidget(data.widgetName),
      data.customText.toUpperCase().replaceAll(" ", "").replaceAll(".", "")
    );
    cy.get(
      commonWidgetSelector.validationFeedbackMessage(data.widgetName)
    ).verifyVisibleElement(
      "have.text",
      commonWidgetText.maxLengthValidationError(data.maximumLength)
    );
    cy.forceClickOnCanvas();
    verifyTooltip(
      commonWidgetSelector.draggableWidget(data.widgetName),
      data.tooltipText
    );
  });

  it("should verify the styles of the text input widget", () => {
    const data = {};
    data.appName = `${fake.companyName}-App`;
    data.colourHex = fake.randomRgbaHex;
    data.boxShadowColor = fake.randomRgba;
    data.boxShadowParam = fake.boxShadowParam;
    data.bgColor = fake.randomRgba;
    data.borderColor = fake.randomRgba;
    data.textColor = fake.randomRgba;
    data.errorTextColor = fake.randomRgba;
    data.iconColor = fake.randomRgba;
    data.labelColor = fake.randomRgba;
    data.widgetName = textInputText.defaultWidgetName;

    openEditorSidebar(textInputText.defaultWidgetName);
    cy.get(commonWidgetSelector.buttonStylesEditorSideBar).click();
    addAllInputFieldColors(data);

    cy.clearAndType('[data-cy="border-radius-input"]', "20");
    cy.get('[data-cy="icon-visibility-button"]').click();

    cy.forceClickOnCanvas();
    cy.get(
      commonWidgetSelector.draggableWidget(textInputText.defaultWidgetName)
    ).should("have.css", "border-radius", "20px");

    verifyInputFieldColors("textinput1", data);

    verifyStylesGeneralAccordion(
      textInputText.defaultWidgetName,
      data.boxShadowParam,
      data.colourHex,
      data.boxShadowColor,
      4
    );

    openEditorSidebar(textInputText.defaultWidgetName);
    cy.get(commonWidgetSelector.buttonStylesEditorSideBar).click();

    verifyContainerElements();
    checkPaddingOfContainer(textInputText.defaultWidgetName, 1);
    cy.get('[data-cy="togglr-button-none"]').click();
    checkPaddingOfContainer(textInputText.defaultWidgetName, 0);

    verifyLabelStyleElements();
    verifyAlignment(textInputText.defaultWidgetName, "sideLeft");
    cy.get('[data-cy="togglr-button-top"]').click();
    verifyAlignment(textInputText.defaultWidgetName, "topLeft");
    cy.get('[data-cy="togglr-button-right"]').click();
    verifyAlignment(textInputText.defaultWidgetName, "topRight");
    cy.get('[data-cy="togglr-button-side"]').click();
    verifyAlignment(textInputText.defaultWidgetName, "sideRight");
    cy.get('[data-cy="togglr-button-left"]').click();
    verifyAlignment(textInputText.defaultWidgetName, "sideLeft");
    addCustomWidthOfLabel("50");
    verifyCustomWidthOfLabel(textInputText.defaultWidgetName, "35");
    selectColourFromColourPicker(
      "Text",
      data.labelColor,
      0,
      commonWidgetSelector.colourPickerParent,
      "0"
    );
    verifyWidgetColorCss(
      `[data-cy="label-${textInputText.defaultWidgetName}"]>label`,
      "color",
      data.labelColor,
      true
    );

    cy.openInCurrentTab(commonWidgetSelector.previewButton);
    verifyWidgetColorCss(
      `[data-cy="label-${textInputText.defaultWidgetName}"]>label`,
      "color",
      data.labelColor,
      true
    );

    verifyAlignment(textInputText.defaultWidgetName, "sideLeft");
    verifyCustomWidthOfLabel(textInputText.defaultWidgetName, "35");
    verifyInputFieldColors("textinput1", data);

    verifyBoxShadowCss(
      textInputText.defaultWidgetName,
      data.boxShadowColor,
      data.boxShadowParam
    );

    cy.get(
      commonWidgetSelector.draggableWidget(textInputText.defaultWidgetName)
    ).should("have.css", "border-radius", "20px");
  });

  it.skip("should verify the app preview", () => {});

  it("should verify CSA", () => {
    const data = {};
    data.customText = randomString(12);
    data.widgetName = textInputText.defaultWidgetName;

    addCSA(data);
    verifyCSA(data);

    cy.openInCurrentTab(commonWidgetSelector.previewButton);
    verifyCSA(data);
  });
});
