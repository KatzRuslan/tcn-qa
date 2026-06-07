import { Injector, computed, runInInjectionContext, inject, signal } from '@angular/core';
import { signalStore, withState, withProps, withMethods, withComputed, withHooks } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { initialTemplatesSlice } from './templates.slice';
import { getTemplates, getFamily, checkImages, initTemplatesStoreHelperContext, viewExcel, saveExcel } from './templates.helper';
import { setTotal, pushFailed, setStatus, initStore, putConfigurations, clearFaileds } from './templates.updates';
import { vmImages, vmNoProperies, vmNotfounds } from './templates.vm-builder';
import { HttpClient } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { ICheckImage, IConfigurations, ITemplate } from '../templates.interface';
import { switchMap, pipe, tap } from 'rxjs';
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
            httpClient: inject(HttpClient),
            _appStore: (): any => {
                appStore ??= runInInjectionContext(injector, () => inject(AppStore));
                return appStore;
            },
            tempatesProcess: signal(0),
            imagesProcess: signal(0),
            imagesTotal: signal(0),
		}
	}),
	withMethods(store => {
        let _templates: ITemplate[] = [];
        let _chekimages: { template: ITemplate; images: ICheckImage[] }[] = [];
        const _imagesCheck = () => {
            if (_chekimages.length === 0) {
                store.imagesProcess.set(store.imagesTotal());
                updateState(store, '[TemplatesStore Done]', setStatus('done'));
                store._appStore().showToastMessages([
                    { detail: 'Templates images check complete', severity: 'success' },
                ]);
                return;
            }
            const { template, images } = _chekimages.pop()!;
            runInInjectionContext(store._injector, () => {
                checkImages(images).subscribe(({ issues, details }) => {
                    if (issues.length) {
                        updateState(store, '[TemplatesStore Push Failed]', pushFailed({ ...template, issues, details }));
                    }
                    store.imagesProcess.update(current => current + images.length); // nosonar (it will need to be repaired)
                    _imagesCheck();
                });
            });
        };
        const _getFamily = () => {
            const template = _templates.pop();
            if (!template) {;
                store._appStore().showToastMessages([
                    { detail: 'Templates existence check complete', severity: 'success' },
                    { detail: 'Templates properties check complete', severity: 'success' },
                ]);
                _imagesCheck();
                return;
            }
            store.tempatesProcess.update(current => current + 1);
            runInInjectionContext(store._injector, () => {
                getFamily(template).subscribe({
                    next: ({ issues, details, images }) => {
                        if (issues.length) {
                            updateState(store, '[TemplatesStore Push Failed]', pushFailed({ ...template, issues, details }));
                        }
                        _chekimages.push({ template, images });
                        store.imagesTotal.update(current => current + images.length); // nosonar (it will need to be repaired)
                        _getFamily();
                    },
                    error: _ => {
                        updateState(store, '[TemplatesStore Push Failed]', pushFailed({ ...template, issues: [{ status: '404', message: 'Not found' }], details: [] }));
                        _getFamily();
                    },
                });
            });
        };
        return {
            getFamily: _getFamily,
            startTest: rxMethod<void>(
                pipe(
                    tap(_ => {
                        _templates = [];
                        _chekimages = [];
                        store.tempatesProcess.set(0);
                        store.imagesProcess.set(0);
                        store.imagesTotal.set(0);
                        updateState(store, '[TemplatesStore Set Total]', setTotal(0), clearFaileds());
                    }),
                    switchMap(
                        _ => getTemplates(store.configurations()).pipe(
                            tapResponse({
                                next: templates => {
                                    _templates.push(...templates);
                                    updateState(store, '[TemplatesStore Set Total]', setTotal(_templates.length));
                                    updateState(store, '[TemplatesStore Running]', setStatus('running'));
                                    _getFamily();
                                },
                                error: (err: Error) => { console.error(err.message) }
                            }),
                        )
                    )
                )
            ),
            saveExcel: () => {
                saveExcel(store.faileds())
            },
            viewExcel: () => {
                viewExcel(store.faileds())
            },
            putConfigurations: (configurations: IConfigurations) => updateState(store, '[TemplatesStore Put Configurations]', putConfigurations(configurations)),
            // saveJson: () => {},
            // viewCsv: () => {},
            // viewJson: () => {},
        }
    }),
	withComputed(store => {
        return {
            inputConfigurations: computed(() => ({
                vmodel: store.configurations(),
                options: store.options(),
            })),
            notfounds: computed(() => vmNotfounds(store.faileds())),
            noproperties: computed(() => vmNoProperies(store.faileds())),
            noimages: computed(() => vmImages(store.faileds())),
            isRunning: computed(() => store.status() === 'running'),
            process: computed(() => ({
                templates: {
                    current: store.tempatesProcess(),
                    total: store.total(),
                },
                images: {
                    current: store.imagesProcess(),
                    total: store.imagesTotal(),
                },
            }))
        }
    }),
	withHooks({
		async onInit(store) {
            const { templateConfigurations } = await (globalThis as any).electronAPI.getConfig();
            updateState(store, '[TemplatesStore InitStore]', initStore(templateConfigurations));
            initTemplatesStoreHelperContext({
                httpClient: store.httpClient
            });
            // const { total, faileds } = await (globalThis as any).electronAPI.getConfig();
            // updateState(store, '[TemplatesStore Set Total]', setTotal(total));
            // for (const failed of faileds) {
            //     updateState(store, '[TemplatesStore Push Failed]', pushFailed(failed as ITemplate));
            // }
            // store.startTest();
		},
	}),
	withDevtools('templates-store'),
);
