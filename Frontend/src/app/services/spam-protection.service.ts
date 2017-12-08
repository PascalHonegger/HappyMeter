import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

// 20 Seconds
const sendBlockedDuration = 20000;

const localStorageBlockSendKey = 'SendIsBlocked';

@Injectable()
export class SpamProtectionService {
    public get isSendingEmotionalStateBlocked(): boolean {
        return this._isSendingEmotionalStateBlocked;
    }

    private _isSendingEmotionalStateBlocked: boolean = false;

    constructor(private snackBar: MatSnackBar) {
        if (localStorage.getItem(localStorageBlockSendKey) === true.toString()) {
            this.sentEmotionalState();
        }
    }

    public sentEmotionalState() {
        // Inform user
        const snackRef = this.snackBar.open(
            'Gesendet - Bitte warten Sie, bis Sie weitere Gefühlslagen erfassen können');

        this.setSendingBlockedState(true);

        setTimeout(() => {
            this.setSendingBlockedState(false);
            snackRef.dismiss();
        }, sendBlockedDuration);
    }

    private setSendingBlockedState(value: boolean) {
        localStorage.setItem(localStorageBlockSendKey, value.toString());
        this._isSendingEmotionalStateBlocked = value;
    }
}
