Feature: Sample Test
  In order to run a sample series of tests
  As a user I want to run a test on sample UI
  I want to confirm pages load as expected

  @Scenario2 @P0 @users
  Scenario: Can navigate from users to home page
    Given I load the users page url
    And I see the home link
    When I click on the home link
    Then I see the home page

  @Scenario3 @P0 @users @skip
  Scenario: Users page displays my name
    Given I load the users page
    And I do something not yet defined
