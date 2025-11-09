class TestData {
  static validPokemonData() {
    return {
      name: "grimer",
      order: 141,
      id: 88
    };
  }

  static invalidPokemonData() {
    return {
      name: "grimor",
      order: 0,
      id: 8888
    };
  }

  static generateRandomString(length = 10) {
    return Math.random().toString(36).substring(2, length + 2);
  }

  static generateRandomEmail() {
    return `test${this.generateRandomString()}@example.com`;
  }
}

module.exports = TestData;