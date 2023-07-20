
const data = [
    {
        firstName: "Phil",
        lastName: "Jones",
        username: "pj@example.com"
    }
];

class MockUsers {
    static data = data;

    get users() {
        return MockUsers.data;
    }
}

module.exports = MockUsers;
