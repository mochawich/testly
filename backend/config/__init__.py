import os
import dotenv
try:
    from ansible.parsing import vault
except ImportError:
    vault = None
import logging

logger = logging.getLogger(__name__)

CONFIG_DIR = os.path.dirname(os.path.realpath(__file__))


def load_env(env_name, raise_errors=False):
    """
    Reads environment variables from .env file based on `env_name` and loads them to os.environ to be used by the app.

    The .env file should be located in the same directory of this file and is lower-cased. The .env file can be also
    encrypted using ansible-vault. In this case `ansible` pip package must be installed and `ANSIBLE_VAULT_PASS`
    environment variable should be set to the phrase used to encrypt the .env file.

    Usage:
    `load_env(env_name='LOCAL')`

    This will look for `local.env` to load environment variables from.

    :param str env_name: environment name
    :param bool raise_errors: whether to raise FileNotFoundError if the environment file does not exist
    """
    env_file = os.path.join(CONFIG_DIR, env_name + '.env').lower()
    if not os.path.exists(env_file):
        msg = "Environment file '{}' does not exist. It seems that there are no configurations for '{}' environment."\
            .format(env_file, env_name)
        if raise_errors:
            raise FileNotFoundError(msg)
        else:
            logger.warning(msg)
            return
    env_data = open(env_file).read()
    encrypted = vault is not None and vault.is_encrypted(env_data)

    # Decrypt the env file and save the decrypted data to a tmp env file
    if encrypted:
        try:
            password = os.environ.get('ANSIBLE_VAULT_PASS', '')
            env_file = os.path.join(CONFIG_DIR, 'tmp.env')
            my_vault = vault.VaultLib(password)
            data = my_vault.decrypt(env_data, env_file)
            with open(env_file, 'wb') as f:
                f.write(data)
        except vault.AnsibleError:
            raise ValueError('Missing or incorrectly set `ANSIBLE_VAULT_PASS` environment variable.')

    # Read the env file
    dotenv.read_dotenv(env_file)
    logger.info("Loaded {}environment variables from '{}'".format('encrypted ' if encrypted else '', env_file))

    # Remove the tmp env file after successful reading
    if encrypted:
        os.remove(env_file)
