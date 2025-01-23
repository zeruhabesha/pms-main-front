class GuestError extends Error {
    constructor(message, details = '') {
        super(message);
        this.name = 'GuestError';
        this.details = details;
    }
}

export { GuestError };