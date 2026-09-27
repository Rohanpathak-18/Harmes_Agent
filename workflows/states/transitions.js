const JOB_STATES = require("./jobStates");

const transitions = {
    [JOB_STATES.DISCOVERED]: [
        JOB_STATES.RESEARCHING,
        JOB_STATES.CANCELLED,
    ],

    [JOB_STATES.RESEARCHING]: [
        JOB_STATES.RESEARCH_READY,
        JOB_STATES.FAILED,
    ],

    [JOB_STATES.RESEARCH_READY]: [
        JOB_STATES.SCRIPTING,
        JOB_STATES.FAILED,
    ],

    [JOB_STATES.SCRIPTING]: [
        JOB_STATES.PRODUCTION,
        JOB_STATES.FAILED,
    ],

    [JOB_STATES.PRODUCTION]: [
        JOB_STATES.FINAL_QA,
        JOB_STATES.FAILED,
    ],

    [JOB_STATES.FINAL_QA]: [
        JOB_STATES.WAITING_APPROVAL,
        JOB_STATES.FAILED,
    ],

    [JOB_STATES.WAITING_APPROVAL]: [
        JOB_STATES.APPROVED,
    ],

    [JOB_STATES.APPROVED]: [
        JOB_STATES.SCHEDULED,
    ],

    [JOB_STATES.SCHEDULED]: [
        JOB_STATES.PUBLISHED,
    ],

    [JOB_STATES.PUBLISHED]: [
        JOB_STATES.ANALYZING,
    ],

    [JOB_STATES.ANALYZING]: [
        JOB_STATES.LEARNED,
    ],

    [JOB_STATES.FAILED]: [
        JOB_STATES.RESEARCHING,
        JOB_STATES.SCRIPTING,
        JOB_STATES.PRODUCTION,
        JOB_STATES.CANCELLED,
    ],
};

const canTransition = (currentState, nextState) => {
    return transitions[currentState]?.includes(nextState) || false;
};

module.exports = {
    transitions,
    canTransition,
};