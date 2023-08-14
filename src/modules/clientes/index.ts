import Repository from '../../globals/repositories/knex/clientes';
import { ClientModule } from './service';

const ClientRepository = new Repository();
const Client = new ClientModule(ClientRepository);

export default Client;
