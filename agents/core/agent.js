class Agent {
    constructor({ id, name, capabilities = [] }) {
        this.id = id;
        this.name = name;
        this.capabilities = capabilities;
    }

    async execute(context) {
        throw new Error(
            `${this.name} must implement the execute() method`
        );
    }
}

module.exports = Agent;