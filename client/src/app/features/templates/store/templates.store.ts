import { Injector, computed, runInInjectionContext, inject, signal } from '@angular/core';
import { signalStore, withState, withProps, withMethods, withComputed, withHooks } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { initialTemplatesSlice } from './templates.slice';
import { getTemplates, getFamily, checkImages, initTemplatesStoreHelperContext } from './templates.helper';
import { setTotal, pushFailed, setStatus } from './templates.updates';
import { vmImages, vmNoProperies, vmNotfounds } from './templates.vm-builder';
import { HttpClient } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { ITemplate } from '../templates.interface';
import { firstValueFrom, switchMap, pipe, finalize } from 'rxjs';
//
import { Store as AppStore } from '@app-store';

export const Store = signalStore(
	{ providedIn: 'root' },
	withState(initialTemplatesSlice),
	withProps(_ => {
        const injector = inject(Injector);
        let appStore: InstanceType<typeof AppStore> | null = null;
		return {
			_injector: injector,
            _appStore: (): any => {
                appStore ??= runInInjectionContext(injector, () => inject(AppStore));
                return appStore;
            },
            _check: signal<ITemplate[]>([]),
            _templates: signal<ITemplate[]>([]),
		}
	}),
	withMethods(store => {
        const successful: ITemplate[] = [];
        const _imagesCheck = () => {
            const templates = store._check();
            const template = templates.pop();
            if (!template) {
                updateState(store, '[TemplatesStore Done]', setStatus('done'));
                return;
            }
            store._check.set(templates);
            runInInjectionContext(store._injector, () => {
                checkImages(template).subscribe(({ count404, total }) => {
                    if (count404 > 0) {
                        const issues = [...(template.issues ?? []), { status: 'IMG_404', message: `${count404}/${total} images 404` }];
                        updateState(store, '[TemplatesStore Push Failed]', pushFailed({ ...template, issues }));
                    }
                    _imagesCheck();
                });
            });
        };
        const _continueCheck = () => {
            for (const template of store._templates()) {
                let emptyPropertiesCounter = 0;
                for (const { payload } of template.implants) {
                    if (payload.properties.length === 0) {
                        emptyPropertiesCounter++;
                    }
                }
                if (emptyPropertiesCounter) {
                    updateState(store, '[TemplatesStore Push Failed]', pushFailed({ ...template, issues: [{ status: 'EMPT_PROPS', message: `Empty properies ${emptyPropertiesCounter}/${template.implants.length}` }] }));
                }
            }
            store._check.set([...store._templates()]);
            // store._check.set(mock); **************
            _imagesCheck();
        };
        const _getFamily = () => {
            const templates = store._check();
            const template = templates.pop();
            if (!template) {
                store._templates.set([...successful]);
                successful.length = 0;
                _continueCheck();
                return;
            }
            store._check.set(templates);
            runInInjectionContext(store._injector, () => {
                getFamily(template).subscribe({
                    next: family => {
                        successful.push(family);
                        _getFamily();
                    },
                    error: _ => {
                        updateState(store, '[TemplatesStore Push Failed]', pushFailed({ ...template, issues: [{ status: '404', message: 'Not found' }] }));
                        _getFamily();
                    }
                });
            });
        };
        return {
            getFamily: _getFamily
        }
    }),
	withComputed(store => {
        return {
            notfounds: computed(() => vmNotfounds(store.faileds())),
            noproperties: computed(() => vmNoProperies(store.faileds())),
            noimages: computed(() => vmImages(store.faileds())),
            isRunning: computed(() => store.status() === 'running'),
        }
    }),
	withHooks({
		onInit(store) {
            initTemplatesStoreHelperContext({
                httpClient: inject(HttpClient)
            });
            rxMethod<void>(
                pipe(
                    switchMap(_ =>
                        getTemplates().pipe(
                            tapResponse({
                                next: templates => store._templates.set(templates),
                                error: (err: Error) => { console.error(err.message) }
                            }),
                            finalize(() => {
                                store._check.set([...store._templates()]);
                                updateState(store, '[TemplatesStore Set Total]', setTotal(store._templates().length));
                                updateState(store, '[TemplatesStore Running]', setStatus('running'));
                                store.getFamily();// vremeno izolirovan - ne trogat'
                            })
                        )),
                )
            )();
		},
	}),
	withDevtools('templates-store'),
);
