Feature: Sample Test
  In order to run a sample series of tests
  As a user I want to run a test on sample UI
  I want to confirm pages load as expected

  @Scenario1 @P0 @home
  Scenario: Can navigate from home to users page
    Given I load the home page url
    And I see the users link
    When I click on the users link
    Then I see the users page


  @Scenario2 @P0 @home @shouldSkipDuringFullRun @skip
  Scenario: Login page loads first
    Given I try to load an unauthenticated page
