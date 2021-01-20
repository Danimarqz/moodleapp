// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { CoreMainMenuTabRoutingModule } from '@features/mainmenu/mainmenu-tab-routing.module';
import { CORE_SITE_SCHEMAS } from '@services/sites';
import { CoreCourseComponentsModule } from './components/components.module';
import { CoreCourseDirectivesModule } from './directives/directives.module';
import { CoreCourseFormatModule } from './format/formats.module';
import { SITE_SCHEMA, OFFLINE_SITE_SCHEMA } from './services/database/course';
import { SITE_SCHEMA as LOG_SITE_SCHEMA } from './services/database/log';
import { SITE_SCHEMA as PREFETCH_SITE_SCHEMA } from './services/database/module-prefetch';
import { CoreCourseIndexRoutingModule } from './pages/index/index-routing.module';
import { CoreCourseModulePrefetchDelegate } from './services/module-prefetch-delegate';

const routes: Routes = [
    {
        path: 'course',
        loadChildren: () => import('@features/course/course-lazy.module').then(m => m.CoreCourseLazyModule),
    },
];

const courseIndexRoutes: Routes = [
    {
        path: 'contents',
        loadChildren: () => import('./pages/contents/contents.module').then(m => m.CoreCourseContentsPageModule),
    },
];

@NgModule({
    imports: [
        CoreCourseIndexRoutingModule.forChild({ children: courseIndexRoutes }),
        CoreMainMenuTabRoutingModule.forChild(routes),
        CoreCourseFormatModule,
        CoreCourseComponentsModule,
        CoreCourseDirectivesModule,
    ],
    exports: [CoreCourseIndexRoutingModule],
    providers: [
        {
            provide: CORE_SITE_SCHEMAS,
            useValue: [SITE_SCHEMA, OFFLINE_SITE_SCHEMA, LOG_SITE_SCHEMA, PREFETCH_SITE_SCHEMA],
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [],
            useFactory: () => () => {
                CoreCourseModulePrefetchDelegate.instance.initialize();
            },
        },
    ],
})
export class CoreCourseModule {}
