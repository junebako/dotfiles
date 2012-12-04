# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/bin

export PATH
unset USERNAME

# rvm-install added line:
if [[ -s /Users/june29/.rvm/scripts/rvm ]] ; then source /Users/june29/.rvm/scripts/rvm ; fi

