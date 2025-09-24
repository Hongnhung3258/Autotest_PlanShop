import BasePage from './BasePage';

class RegisterPage extends BasePage {
  constructor() {
    super();
    
    // Form input selectors
    this.emailInputSelector = 'input[name="xoo_el_reg_email"]';
    this.firstNameInputSelector = 'input[name="xoo_el_reg_fname"]';
    this.lastNameInputSelector = 'input[name="xoo_el_reg_lname"]';
    this.passwordInputSelector = 'input[name="xoo_el_reg_pass"]';
    this.confirmPasswordInputSelector = 'input[name="xoo_el_reg_pass_again"]';
    
    // Checkbox and terms selectors
    this.termsCheckboxSelector = 'input[name="xoo_el_reg_terms"]';
    this.termsLabelSelector = '.xoo-aff-required.xoo-aff-checkbox_single label';
    this.privacyPolicyLinkSelector = '.xoo-aff-required.xoo-aff-checkbox_single a';
    
    // Button and form selectors
    this.registerButtonSelector = '.xoo-el-register-btn';
    this.registerPopupSelector = '.xoo-el-srcont';
    this.tabSignUpSelector = '.xoo-el-tabs [data-tab="register"]';
    
    // Message selectors
    this.errorMessageSelector = '.xoo-el-notice .xoo-el-notice-error';
    this.successMessageSelector = '.xoo-el-notice .xoo-el-notice-success';
  }

  switchToRegister() {
    this.clickButton(this.tabSignUpSelector);
    this.verifyElementVisible(this.registerPopupSelector);
  }

  checkMenuHighlight() {
    cy.get(this.tabSignUpSelector).then($loginTab => {
      const inactiveColor = $loginTab.css('background-color');
      this.switchToRegister();
      cy.get(this.tabSignUpSelector).then($activeTab => {
        const activeColor = $activeTab.css('background-color');
        expect(activeColor).to.not.equal(inactiveColor);
      });
    });
  }

  checkRegisterLayout() {
    this.switchToRegister();
    
    this.verifyElementContainsText(this.tabSignUpSelector, 'Đăng ký tài khoản');
    
    this.verifyElementVisible(this.emailInputSelector);
    this.verifyElementVisible(this.firstNameInputSelector);
    this.verifyElementVisible(this.lastNameInputSelector);
    this.verifyElementVisible(this.passwordInputSelector);
    this.verifyElementVisible(this.confirmPasswordInputSelector);
    
    cy.get(this.termsCheckboxSelector)
      .should('be.visible')
      .and('have.attr', 'type', 'checkbox')
      .and('not.be.checked');
    
    this.verifyElementContainsText(this.termsLabelSelector, 'I accept the');
    this.verifyElementContainsText(this.privacyPolicyLinkSelector, 'Terms of Service and Privacy Policy');
    
    this.verifyElementVisible(this.registerButtonSelector);
  }

  checkRequiredFields(errorMsg) {
    const inputSelectors = [
      this.emailInputSelector,
      this.firstNameInputSelector,
      this.lastNameInputSelector,
      this.passwordInputSelector,
      this.confirmPasswordInputSelector
    ];

    inputSelectors.forEach(selector => {
      this.ifElementExists(selector, () => {
        cy.get(selector).then($input => {
          if ($input[0].validationMessage) {
            expect($input[0].validationMessage).to.equal(errorMsg);
          }
        });
      });
    });
  }

  checkInvalidFieldEmail(errorMsg) {
    cy.checkInvalidField(this.emailInputSelector, errorMsg);
  }

  checkNoticeError(errorMsg) {
    cy.checkNotice(this.errorMessageSelector, errorMsg);
  }

  checkNoticeSuccess(successMsg) {
    cy.checkNotice(this.successMessageSelector, successMsg);
  }

  openPrivacyPolicy() {
    this.switchToRegister();
    cy.get(this.privacyPolicyLinkSelector).invoke('removeAttr', 'target').click();
    this.verifyCurrentUrl('/privacy-policy');
    this.verifyElementContainsText('h2', 'Chính sách bảo mật');
  }

  registerSuccess(successMsg) {
    this.checkNoticeSuccess(successMsg);
    cy.url({ timeout: 10000 }).should('include', '/my-account');
  }

  fillRegistrationForm(registrationData) {
    this.switchToRegister();
    
    if (registrationData.email) {
      this.clearAndType(this.emailInputSelector, registrationData.email);
    }
    if (registrationData.firstName) {
      this.clearAndType(this.firstNameInputSelector, registrationData.firstName);
    }
    if (registrationData.lastName) {
      this.clearAndType(this.lastNameInputSelector, registrationData.lastName);
    }
    if (registrationData.password) {
      this.clearAndType(this.passwordInputSelector, registrationData.password);
    }
    if (registrationData.confirmPassword) {
      this.clearAndType(this.confirmPasswordInputSelector, registrationData.confirmPassword);
    }
    if (registrationData.acceptTerms) {
      this.checkCheckbox(this.termsCheckboxSelector);
    }
  }

  submitRegistration() {
    this.clickButton(this.registerButtonSelector);
  }

  register(email, firstName, lastName, password, confirmPassword, acceptTerms = true) {
    const registrationData = {
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      acceptTerms
    };
    
    this.fillRegistrationForm(registrationData);
    this.submitRegistration();
  }


  verifyTermsCheckboxState(shouldBeChecked) {
    if (shouldBeChecked) {
      cy.get(this.termsCheckboxSelector).should('be.checked');
    } else {
      cy.get(this.termsCheckboxSelector).should('not.be.checked');
    }
  }

  verifyInputFieldsEmpty() {
    cy.get(this.emailInputSelector).should('have.value', '');
    cy.get(this.firstNameInputSelector).should('have.value', '');
    cy.get(this.lastNameInputSelector).should('have.value', '');
    cy.get(this.passwordInputSelector).should('have.value', '');
    cy.get(this.confirmPasswordInputSelector).should('have.value', '');
  }

  verifyInputFieldPlaceholders() {
    cy.get(this.emailInputSelector).should('have.attr', 'placeholder');
    cy.get(this.firstNameInputSelector).should('have.attr', 'placeholder');
    cy.get(this.lastNameInputSelector).should('have.attr', 'placeholder');
    cy.get(this.passwordInputSelector).should('have.attr', 'placeholder');
    cy.get(this.confirmPasswordInputSelector).should('have.attr', 'placeholder');
  }
}

export default RegisterPage;