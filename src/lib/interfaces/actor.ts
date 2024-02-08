import { WithAction } from './with-action';
import { WithBody } from './with-body';
import { WithPhysic } from './with-physic';

export interface Actor extends WithAction, WithBody, WithPhysic {}
