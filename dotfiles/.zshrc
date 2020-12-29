# Lines configured by zsh-newuser-install
HISTFILE=~/.histfile
HISTSIZE=1000
SAVEHIST=1000
bindkey -e
# End of lines configured by zsh-newuser-install
# The following lines were added by compinstall
zstyle :compinstall filename '/home/duncanf/.zshrc'

autoload -Uz compinit
compinit

source ~/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh

export PATH="$HOME/.cargo/bin:$PATH"

eval "$(starship init zsh)"


# Permanent Aliases
alias cimg='silicon --theme TwoDark --no-window-controls --no-round-corner -b "#aaaaaa" -c'
alias lh='ls -lh'

# End of lines added by compinstall
