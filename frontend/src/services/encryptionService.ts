import CryptoJS from 'crypto-js';

const SECRET_KEY = 'tu_clave_secreta_muy_segura'; // En producción, esto debería venir de variables de entorno

export interface TokenData {
    token: string;
    firstName?: string;
    lastName?: string;
    userRole?: string;
}

export const encryptionService = {
    encryptToken(data: TokenData): string {
        const jsonString = JSON.stringify(data);
        return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    },

    decryptToken(encryptedData: string): TokenData | null {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedString);
        } catch (error) {
            console.error('Error al desencriptar el token:', error);
            return null;
        }
    },

    storeEncryptedToken(data: TokenData) {
        const encryptedToken = this.encryptToken(data);
        localStorage.setItem('encryptedAuthToken', encryptedToken);
    },

    getDecryptedToken(): TokenData | null {
        const encryptedToken = localStorage.getItem('encryptedAuthToken');
        if (!encryptedToken) return null;
        return this.decryptToken(encryptedToken);
    },

    removeToken() {
        localStorage.removeItem('encryptedAuthToken');
    }
}; 