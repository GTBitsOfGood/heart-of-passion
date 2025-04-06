import { AnalyticsLogger, EventEnvironment } from 'bog-analytics';

const developmentLogger = new AnalyticsLogger({ environment: EventEnvironment.DEVELOPMENT });
const stagingLogger = new AnalyticsLogger({ environment: EventEnvironment.STAGING });
const productionLogger = new AnalyticsLogger({ environment: EventEnvironment.PRODUCTION });

export const CustomEventTypes = {
    USER_LOGIN: {
        category: "User",
        subcategory: "Login"
    },
    EVENT_CREATION: {
        category: "Event",
        subcategory: "Create"
    },
    EVENT_EDIT: {
        category: "Event",
        subcategory: "Edit"
    },
    EVENT_DELETE: {
        category: "Event",
        subcategory: "Delete"
    },
    EXPENSE_CREATION: {
        category: "Expense",
        subcategory: "Create"
    },
    EXPENSE_EDIT: {
        category: "Expense",
        subcategory: "Edit"
    },
    EXPENSE_DELETE: {
        category: "Expense",
        subcategory: "Delete"
    },
    FUNDRAISER_CREATION: {
        category: "Fundraiser",
        subcategory: "Create"
    },
    FUNDRAISER_EDIT: {
        category: "Fundraiser",
        subcategory: "Edit"
    },
    FUNDRAISER_DELETE: {
        category: "Fundraiser",
        subcategory: "Delete"
    },
    DONOR_CREATION: {
        category: "Donor",
        subcategory: "Create"
    },
    DONOR_EDIT: {
        category: "Donor",
        subcategory: "Edit"
    },
    DONOR_DELETE: {
        category: "Donor",
        subcategory: "Delete"
    },
}

const apiKey = process.env.NEXT_PUBLIC_BOG_ANALYTICS_CLIENT_API_KEY as string;
developmentLogger.authenticate(apiKey);
stagingLogger.authenticate(apiKey);
productionLogger.authenticate(apiKey);

export function getAnalyticsLogger() {
    if (process.env.NEXT_PUBLIC_CONTEXT === "production") {
        return productionLogger;
    }

    if (process.env.NEXT_PUBLIC_CONTEXT === "staging") {
        return stagingLogger;
    }

    return developmentLogger;
}

export async function logUserLoginEvent(){
    const analyticsLogger = getAnalyticsLogger();
    await analyticsLogger.logCustomEvent(CustomEventTypes.USER_LOGIN.category, CustomEventTypes.USER_LOGIN.subcategory, {
    })
}

export async function logEventCreationEvent(name: string){
    const analyticsLogger = getAnalyticsLogger();
    await analyticsLogger.logCustomEvent(CustomEventTypes.EVENT_CREATION.category, CustomEventTypes.EVENT_CREATION.subcategory, {
        name
    })
}

export async function logEventEditEvent(name: string){
    const analyticsLogger = getAnalyticsLogger();
    await analyticsLogger.logCustomEvent(CustomEventTypes.EVENT_EDIT.category, CustomEventTypes.EVENT_EDIT.subcategory, {
        name
    })
}

export async function logEventDeleteEvent(name: string){
    const analyticsLogger = getAnalyticsLogger();
    await analyticsLogger.logCustomEvent(CustomEventTypes.EVENT_DELETE.category, CustomEventTypes.EVENT_DELETE.subcategory, {
        name
    })
}
export async function logExpenseCreationEvent(name: string) {
    const analyticsLogger = getAnalyticsLogger();
    await analyticsLogger.logCustomEvent(CustomEventTypes.EXPENSE_CREATION.category, CustomEventTypes.EXPENSE_CREATION.subcategory, {
        name
    });
}

export async function logExpenseEditEvent(name: string) {
    const analyticsLogger = getAnalyticsLogger();
    await analyticsLogger.logCustomEvent(CustomEventTypes.EXPENSE_EDIT.category, CustomEventTypes.EXPENSE_EDIT.subcategory, {
        name
    });
}

export async function logExpenseDeleteEvent(name: string) {
    const analyticsLogger = getAnalyticsLogger();
    await analyticsLogger.logCustomEvent(CustomEventTypes.EXPENSE_DELETE.category, CustomEventTypes.EXPENSE_DELETE.subcategory, {
        name
    });
}

export async function logFundraiserCreationEvent(name: string) {
    const analyticsLogger = getAnalyticsLogger();
    await analyticsLogger.logCustomEvent(CustomEventTypes.FUNDRAISER_CREATION.category, CustomEventTypes.FUNDRAISER_CREATION.subcategory, {
        name
    });
}

export async function logFundraiserEditEvent(name: string) {
    const analyticsLogger = getAnalyticsLogger();
    await analyticsLogger.logCustomEvent(CustomEventTypes.FUNDRAISER_EDIT.category, CustomEventTypes.FUNDRAISER_EDIT.subcategory, {
        name
    });
}

export async function logFundraiserDeleteEvent(name: string) {
    const analyticsLogger = getAnalyticsLogger();
    await analyticsLogger.logCustomEvent(CustomEventTypes.FUNDRAISER_DELETE.category, CustomEventTypes.FUNDRAISER_DELETE.subcategory, {
        name
    });
}

export async function logDonorCreationEvent(name: string) {
    const analyticsLogger = getAnalyticsLogger();
    await analyticsLogger.logCustomEvent(CustomEventTypes.DONOR_CREATION.category, CustomEventTypes.DONOR_CREATION.subcategory, {
        name
    });
}

export async function logDonorEditEvent(name: string) {
    const analyticsLogger = getAnalyticsLogger();
    await analyticsLogger.logCustomEvent(CustomEventTypes.DONOR_EDIT.category, CustomEventTypes.DONOR_EDIT.subcategory, {
        name
    });
}

export async function logDonorDeleteEvent(name: string) {
    const analyticsLogger = getAnalyticsLogger();
    await analyticsLogger.logCustomEvent(CustomEventTypes.DONOR_DELETE.category, CustomEventTypes.DONOR_DELETE.subcategory, {
        name
    });
}

export { developmentLogger, stagingLogger, productionLogger };