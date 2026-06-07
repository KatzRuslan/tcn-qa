import { environment } from '@environments';

export function vmBaseUrl(serverUrl: string) {
    return environment.production ? environment.serverUrl : serverUrl
}
