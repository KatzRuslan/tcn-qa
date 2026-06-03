import { environment } from '@environments';

export function vmBaseUrl(serverUrl: string) {
    return environment.production ? serverUrl : environment.serverUrl
}
