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
import { ICheckImage, ITemplate, ITemplateDetail } from '../templates.interface';
import { switchMap, pipe, finalize } from 'rxjs';
//
import { Store as AppStore } from '@app-store';
import { REPORT_MOCK } from '@initial-data';

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
        let chekimages: { template: ITemplate; images: ICheckImage[] }[] = [];
        const _imagesCheck = () => {
            if (chekimages.length === 0) {
                console.log('Completed');
                updateState(store, '[TemplatesStore Done]', setStatus('done'));
                return;
            }
            const { template, images } = chekimages.pop()!;
            runInInjectionContext(store._injector, () => {
                checkImages(images).subscribe(({ issues, details }) => {
                    if (issues.length) {
                        updateState(store, '[TemplatesStore Push Failed]', pushFailed({ ...template, issues, details }));
                    }
                    _imagesCheck();
                });
            });
        };
        const _getFamily = () => {
            const templates = store._check();
            const template = templates.pop();
            if (!template) {;
                _imagesCheck();
                return;
            }
            store._check.set(templates);
            runInInjectionContext(store._injector, () => {
                getFamily(template).subscribe({
                    next: ({ issues, details, images }) => {
                        if (issues.length) {
                            updateState(store, '[TemplatesStore Push Failed]', pushFailed({ ...template, issues, details }));
                        }
                        chekimages.push({ template, images });
                        _getFamily();
                    },
                    error: _ => {
                        updateState(store, '[TemplatesStore Push Failed]', pushFailed({ ...template, issues: [{ status: '404', message: 'Not found' }], details: [] }));
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
            const { total, faileds } = REPORT_MOCK;
            updateState(store, '[TemplatesStore Set Total]', setTotal(total));
            for (const failed of faileds) {
                updateState(store, '[TemplatesStore Push Failed]', pushFailed(failed as ITemplate));
            }
            return;
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
                                store.getFamily();
                            })
                        )),
                )
            )();
		},
	}),
	withDevtools('templates-store'),
);
