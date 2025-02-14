import { Database } from '@vuex-orm/core';
import User from '../models/User';
import Incident from '../models/Incident';
import Location from '../models/Location';
import LocationType from '../models/LocationType';
import Language from '../models/Language';
import Organization from '../models/Organization';
import Report from '../models/Report';
import Role from '../models/Role';
import PhoneStatus from '../models/PhoneStatus';
import EventLog from '../models/EventLog';
import WorksiteRequest from '../models/WorksiteRequest';
import Worksite from '../models/Worksite';
import PhoneOutbound from '../models/PhoneOutbound';
import Team from '../models/Team';
import Invitation from '../models/Invitation';
import InvitationRequest from '../models/InvitationRequest';
import Layer from '../models/Layer';
import PasswordResetRequest from '../models/PasswordResetRequest';
import UserRole from '@/models/UserRole';
import Affiliate from '@/models/Affiliate';

const database = new Database();
database.register(User, {});
database.register(Incident, {});
database.register(Location, {});
database.register(LocationType, {});
database.register(Language, {});
database.register(Organization, {});
database.register(Report, {});
database.register(Role, {});
database.register(PhoneStatus, {});
database.register(WorksiteRequest, {});
database.register(Worksite, {});
database.register(PhoneOutbound, {});
database.register(Team, {});
database.register(Layer, {});
database.register(InvitationRequest, {});
database.register(Invitation, {});
database.register(UserRole, {});
database.register(Affiliate, {});
database.register(PasswordResetRequest, {});
database.register(EventLog, {});

export default database;
