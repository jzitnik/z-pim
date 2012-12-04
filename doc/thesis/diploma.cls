%%
%% This is file `diploma.cls',
%% generated with the docstrip utility.
%%
%% The original source files were:
%%
%% DiplomaUserMan.dtx 
%% DiplomaImplementation.dtx
%% 
\def\fileversion{2.2}
\def\filedate{2009/04/16}
\def\docdate{16. dubna 2009}

\NeedsTeXFormat{LaTeX2e}[1995/12/01]
\ProvidesClass{diploma}
  [\filedate\space v\fileversion\space diploma LaTeX document class]
\RequirePackage{ifthen}
\newtoks\Dipl@DiplomaTypeName
\Dipl@DiplomaTypeName={Chyb\'{\i} textov\'{a} reprezentace typu pr\'{a}ce}
\newtoks\Dipl@Department
\Dipl@Department={Katedra informatiky}
\newtoks\Dipl@Author
\Dipl@Author={Chyb\'{\i} autor}
\newtoks\Dipl@Title
\Dipl@Title={Chyb\'{\i} n\'{a}zev pr\'{a}ce}
\newtoks\Dipl@EnglishTitle
\Dipl@EnglishTitle={Chyb\'{\i} anglick\'{y} n\'{a}zev pr\'{a}ce}
\newtoks\Dipl@SubmissionDate
\Dipl@SubmissionDate={Chyb\'{\i} datum odevzd\'{a}n\'{\i} pr\'{a}ce}
\newtoks\Dipl@AccessRestriction
\Dipl@AccessRestriction={}
\newtoks\Dipl@Thanks
\Dipl@Thanks={}
\newtoks\Dipl@CzechAbstract
\Dipl@CzechAbstract={Chyb\'{\i} \v{c}esk\'{y} abstrakt}
\newtoks\Dipl@CzechKeywords
\Dipl@CzechKeywords={Chyb\'{\i} \v{c}esk\'{a} kl\'{\i}\v{c}ov\'{a} slova}
\newtoks\Dipl@EnglishAbstract
\Dipl@EnglishAbstract={Chyb\'{\i} anglick\'{y} abstrakt}
\newtoks\Dipl@EnglishKeywords
\Dipl@EnglishKeywords={Chyb\'{\i} anglick\'{a} kl\'{\i}\v{c}ov\'{a} slova}
\newtoks\Dipl@Acronyms
\Dipl@Acronyms={}
\newtoks\Dipl@DefaultLanguage
\Dipl@DefaultLanguage={java}
\newboolean{Dipl@AuthorIsMale}
\setboolean{Dipl@AuthorIsMale}{true}
\newboolean{Dipl@IsMasterThesis}
\setboolean{Dipl@IsMasterThesis}{true}
\newboolean{Dipl@PrintPublAgreement}
\setboolean{Dipl@PrintPublAgreement}{false}
\DeclareOption{bc}
  {\Dipl@DiplomaTypeName={Bakal\'{a}\v{r}sk\'{a} pr\'{a}ce}\setboolean{Dipl@IsMasterThesis}{false}}
\DeclareOption{ing}
  {\Dipl@DiplomaTypeName={Diplomov\'{a} pr\'{a}ce}\setboolean{Dipl@IsMasterThesis}{true}}
\DeclareOption{dept410}{\Dipl@Department={Katedra elektroenergetiky}}
\DeclareOption{dept420}{\Dipl@Department={Katedra elektrotechniky}}
\DeclareOption{dept430}{\Dipl@Department={Katedra elektroniky}}
\DeclareOption{dept440}{\Dipl@Department={Katedra telekomunika\v{c}n\'{\i} techniky}}
\DeclareOption{dept450}{\Dipl@Department={Katedra m\v{e}\v{r}ic\'{\i} a \v{r}\'{\i}dic\'{\i} techniky}}
\DeclareOption{dept460}{\Dipl@Department={Katedra informatiky}}
\DeclareOption{dept470}{\Dipl@Department={Katedra aplikovan\'{e} matematiky}}
\DeclareOption{male}{\setboolean{Dipl@AuthorIsMale}{true}}
\DeclareOption{female}{\setboolean{Dipl@AuthorIsMale}{false}}
\DeclareOption{vb}{\Dipl@DefaultLanguage={vb}}
\DeclareOption{ansic}{\Dipl@DefaultLanguage={ansic}}
\DeclareOption{cpp}{\Dipl@DefaultLanguage={cpp}}
\DeclareOption{csharp}{\Dipl@DefaultLanguage={csharp}}
\DeclareOption{delphi}{\Dipl@DefaultLanguage={delphi}}
\DeclareOption{html}{\Dipl@DefaultLanguage={html}}
\DeclareOption{idl}{\Dipl@DefaultLanguage={idl}}
\DeclareOption{corba}{\Dipl@DefaultLanguage={corba}}
\DeclareOption{java}{\Dipl@DefaultLanguage={java}}
\DeclareOption{lisp}{\Dipl@DefaultLanguage={lisp}}
\DeclareOption{make}{\Dipl@DefaultLanguage={make}}
\DeclareOption{matlab}{\Dipl@DefaultLanguage={matlab}}
\DeclareOption{pascal}{\Dipl@DefaultLanguage={pascal}}
\DeclareOption{perl}{\Dipl@DefaultLanguage={perl}}
\DeclareOption{php}{\Dipl@DefaultLanguage={php}}
\DeclareOption{sql}{\Dipl@DefaultLanguage={sql}}
\DeclareOption{latex}{\Dipl@DefaultLanguage={latex}}
\DeclareOption{plaintex}{\Dipl@DefaultLanguage={plaintex}}
\DeclareOption{vhdl}{\Dipl@DefaultLanguage={vhdl}}
\DeclareOption{xml}{\Dipl@DefaultLanguage={xml}}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions
\LoadClass[11pt]{article}
\RequirePackage{fancyhdr}
\ifx\pdfoutput\undefined
\setlength{\hoffset}{0.0pt}
\setlength{\oddsidemargin}{7.39772pt}
\setlength{\evensidemargin}{18.77882pt}
\setlength{\headheight}{16.0pt}
\setlength{\textheight}{594.7945pt }
\setlength{\marginparsep}{0.0pt}
\setlength{\footskip}{30.0pt}
\setlength{\topmargin}{-1.1381pt}
\setlength{\headsep}{25.0pt}
\setlength{\textwidth}{426.79135pt}
\setlength{\marginparwidth}{0.0pt}
\setlength{\marginparpush}{5.0pt}
\else
\RequirePackage[a4paper,includeheadfoot,marginparwidth=0mm,marginparsep=0mm,
left=28mm,right=32mm,top=25mm,bottom=38mm,headheight=16pt]{geometry}
\fi
\RequirePackage{graphicx}
\RequirePackage{palatino}
\RequirePackage[final]{listings2}
\RequirePackage{rotating}
\RequirePackage{supertabular}
\RequirePackage{theorem}
\RequirePackage[notindex,nottoc,notlot,notlof,section,numbib]{tocbibind}
\fancyhf{}
\fancyhead[RO,LE]{\sffamily\bfseries\thepage}
\newcommand{\Author}[1]{\Dipl@Author={#1}}
\newcommand{\Title}[1]{\Dipl@Title={#1}}
\newcommand{\EnglishTitle}[1]{\Dipl@EnglishTitle={#1}}
\newcommand{\SubmissionDate}[1]{\Dipl@SubmissionDate={#1}}
\newcommand{\PrintPublicationAgreement}[1]{\setboolean{Dipl@PrintPublAgreement}{#1}}
\newcommand{\AccessRestriction}[1]{\Dipl@AccessRestriction={#1}}
\newcommand{\Thanks}[1]{\Dipl@Thanks={#1}}
\newcommand{\CzechAbstract}[1]{\Dipl@CzechAbstract={#1}}
\newcommand{\CzechKeywords}[1]{\Dipl@CzechKeywords={#1}}
\newcommand{\EnglishAbstract}[1]{\Dipl@EnglishAbstract={#1}}
\newcommand{\EnglishKeywords}[1]{\Dipl@EnglishKeywords={#1}}
\newcommand{\MakeTitlePages}%
{%
  \pagestyle{empty}
  \Dipl@TitlePage
  \includegraphics[width=\textwidth]{../zadani.jpg} 
  \newpage
  \includegraphics[width=\textwidth]{../souhlas.png} 
  \newpage
%   \Dipl@Declaration
  \Dipl@MakeThanks
  \Dipl@AbstractsKeywords
  \Dipl@WriteAcronyms
  \setcounter{page}{1}
  \pagestyle{fancy}
}
\newcommand{\Dipl@TitlePage}
{
  \begin{center}
    \vspace*{-23mm}
    \sffamily
    {\Large{}V\v{S}B -- Technick\'{a} univerzita Ostrava\\
    Fakulta elektrotechniky a informatiky\\
    \the\Dipl@Department\\}
    \medskip
    \hrule
    \vspace{35mm}
    {\Huge\bfseries\the\Dipl@Title\par}
    \bigskip
    {\Huge\bfseries\the\Dipl@EnglishTitle\par}
  \end{center}
  \vfill
  {\sffamily\Large\number\year\hfill\the\Dipl@Author}
  \cleardoublepage
}
\newcommand{\Dipl@MaleMaster}[0]{Prohla\v{s}uji, \v{z}e jsem tuto diplomovou pr\'{a}ci
  vypracoval samostatn\v{e}. Uvedl jsem v\v{s}echny liter\'{a}rn\'{\i} prameny a publikace,
  ze kter\'{y}ch jsem \v{c}erpal.}
\newcommand{\Dipl@FemaleMaster}[0]{Prohla\v{s}uji, \v{z}e jsem tuto diplomovou pr\'{a}ci
  vypracovala samostatn\v{e}. Uvedla jsem v\v{s}echny liter\'{a}rn\'{\i} prameny a publikace,
  ze kter\'{y}ch jsem \v{c}erpala.}
\newcommand{\Dipl@MaleBachelor}[0]{Prohla\v{s}uji, \v{z}e jsem tuto bakal\'{a}\v{r}skou pr\'{a}ci
  vypracoval samostatn\v{e}. Uvedl jsem v\v{s}echny liter\'{a}rn\'{\i} prameny a publikace,
  ze kter\'{y}ch jsem \v{c}erpal.}
\newcommand{\Dipl@FemaleBachelor}[0]{Prohla\v{s}uji, \v{z}e jsem tuto bakal\'{a}\v{r}skou pr\'{a}ci
  vypracovala samostatn\v{e}. Uvedla jsem v\v{s}echny liter\'{a}rn\'{\i} prameny a publikace,
  ze kter\'{y}ch jsem \v{c}erpala.}
\newcommand{\Dipl@BachelorPublAgreement}[0]{Souhlas\'{\i}m se zve\v{r}ejn\v{e}n\'{\i}m
  t\'{e}to bakal\'{a}\v{r}sk\'{e} pr\'{a}ce dle po\v{z}adavk\r{u} \v{c}l.\ 26, odst.\ 9 \textit{Studijn\'{\i}ho a~zku\v{s}ebn\'{\i}ho
  \v{r}\'{a}du pro studium v bakal\'{a}\v{r}sk\'{y}ch programech V\v{S}B-TU Ostrava}.}
\newcommand{\Dipl@MasterPublAgreement}[0]{Souhlas\'{\i}m se zve\v{r}ejn\v{e}n\'{\i}m
  t\'{e}to diplomov\'{e} pr\'{a}ce dle po\v{z}adavk\r{u} \v{c}l.\ 26, odst.\ 9 \textit{Studijn\'{\i}ho a~zku\v{s}ebn\'{\i}ho
  \v{r}\'{a}du pro studium v magistersk\'{y}ch programech V\v{S}B-TU Ostrava}.}
\newcommand{\Dipl@Declaration}
{
  \mbox{}\vfill
  \ifthenelse{\boolean{Dipl@PrintPublAgreement}}{\Dipl@PrintRestriction}{}
  \noindent
  \ifthenelse{\boolean{Dipl@IsMasterThesis}}%
  {\ifthenelse{\boolean{Dipl@AuthorIsMale}}{\Dipl@MaleMaster}{\Dipl@FemaleMaster}}%
  {\ifthenelse{\boolean{Dipl@AuthorIsMale}}{\Dipl@MaleBachelor}{\Dipl@FemaleBachelor}}
  \par
  \vspace{15mm}
  \noindent{}V Ostrav\v{e} \the\Dipl@SubmissionDate\hfill\hbox to50mm{\dotfill}
  \cleardoublepage
}
\newcommand{\Dipl@PrintRestriction}
{
  \noindent
  \ifthenelse{\boolean{Dipl@IsMasterThesis}}
  {\Dipl@MasterPublAgreement}
  {\Dipl@BachelorPublAgreement}
  \par
  \ifthenelse{\equal{\the\Dipl@AccessRestriction}{\empty}}
  {\relax}
  {\bigskip\noindent\the\Dipl@AccessRestriction\par}
  \vspace{15mm}
  \noindent{}V Ostrav\v{e} \the\Dipl@SubmissionDate\hfill\hbox to50mm{\dotfill}
  \par
  \vspace{15mm}
}
\newcommand{\Dipl@MakeThanks}
{
  \ifthenelse{\equal{\the\Dipl@Thanks}{\empty}}{}
  {
    \mbox{}
    \vfill
    \noindent\the\Dipl@Thanks
    \vspace{15mm}
    \cleardoublepage
  }
}
\newcommand{\Dipl@AbstractsKeywords}
{
  \vspace*{20mm}
  \noindent{\sffamily\large\bfseries{}Abstrakt}\par\medskip
  \noindent\the\Dipl@CzechAbstract\par
  \bigskip
  \noindent{\sffamily\bfseries Kl\'{\i}\v{c}ov\'{a} slova:\ }
    \the\Dipl@CzechKeywords\par
  \vspace*{30mm}
  {
    \language=0
    \noindent{\sffamily\large\bfseries{}Abstract}\par\medskip
    \noindent\the\Dipl@EnglishAbstract\par
    \bigskip
    \noindent{\sffamily\bfseries Keywords:\ }
      \the\Dipl@EnglishKeywords\par
  }
  \cleardoublepage
}
\newcommand{\Dipl@AddTokens}[2]{\expandafter \global#1\expandafter{\the#1#2}}
\newcommand{\AddAcronym}[2]{\Dipl@AddTokens{\Dipl@Acronyms}{#1&--&#2\\}}
\newcommand{\Dipl@WriteAcronyms}[0]
{
  \ifthenelse{\equal{\the\Dipl@Acronyms}{\empty}}
  {}
  {
    \clearpage
    \vspace*{20mm}
    \noindent
    {\sffamily\large\bfseries{}Seznam pou\v{z}it\'{y}ch zkratek a symbol\r{u}}
    \begin{flushleft}
      \begin{supertabular}{p{0.2\textwidth}cp{0.7\textwidth}}
        \the\Dipl@Acronyms
      \end{supertabular}
    \end{flushleft}
    \cleardoublepage
  }
}
\renewcommand\section{\cleardoublepage\suppressfloats\@startsection {section}{1}{\z@}%
  {-3.5ex \@plus -1ex \@minus -.2ex}%
  {2.3ex \@plus.2ex}%
  {\normalfont\sffamily\Large\bfseries}}
\renewcommand\subsection{\@startsection{subsection}{2}{\z@}%
  {-3.25ex\@plus -1ex \@minus -.2ex}%
  {1.5ex \@plus .2ex}%
  {\normalfont\sffamily\large\bfseries}}
\renewcommand\subsubsection{\@startsection{subsubsection}{3}{\z@}%
  {-3.25ex\@plus -1ex \@minus -.2ex}%
  {1.5ex \@plus .2ex}%
  {\normalfont\normalsize\sffamily\bfseries}}
\renewcommand\paragraph{\@startsection{paragraph}{4}{\z@}%
  {3.25ex \@plus1ex \@minus.2ex}%
  {-1em}%
  {\normalfont\normalsize\sffamily\bfseries}}
\renewcommand\subparagraph{\@startsection{subparagraph}{5}{\z@}%
  {3.25ex \@plus1ex \@minus .2ex}%
  {-1em}%
  {\normalfont\normalsize\sffamily\bfseries}}
\renewcommand\contentsname{\sffamily{}Obsah}
\renewcommand\listfigurename{\sffamily{}Seznam obr\'{a}zk\r{u}}
\renewcommand\listtablename{\sffamily{}Seznam tabulek}
{\theorembodyfont{\itshape}\newtheorem{definition}{Definice}[section]}
{\theorembodyfont{\itshape}\newtheorem{theorem}{V\v{e}ta}[section]}
\newenvironment{proof}
  {\par\noindent\textbf{D\r{u}kaz.}}
  {\mbox{}\hspace*{5pt}\hfill\hbox{\vrule height5pt depth0pt width5pt}\par\medskip}
{\theorembodyfont{\rmfamily}\newtheorem{remark}{Pozn\'{a}mka}[section]}
{\theoremstyle{break}\theorembodyfont{\rmfamily}
  \newtheorem{Dipl@examplebody}{P\v{r}\'{\i}klad}[section]}
\newenvironment{example}
  {\begin{Dipl@examplebody}}
  {
    \nopagebreak\mbox{}\hspace*{5pt}\hfill\hbox{\vrule height5pt depth0pt width5pt}
    \end{Dipl@examplebody}
  }
\def\lstlistlistingname{\sffamily{}Seznam v\'{y}pis\r{u} zdrojov\'{e}ho k\'{o}du}
\def\lstlistingname{V\'{y}pis}
\newcommand{\Dipl@SetDefaultLanguage}[0]
{
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{vb}}
    {\lstset{language=[Visual]Basic,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{ansic}}
    {\lstset{language=[ANSI]C,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{cpp}}
    {\lstset{language=C++,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{csharp}}
    {\lstset{language=[Sharp]C,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{delphi}}
    {\lstset{language=Delphi,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{html}}
    {\lstset{language=HTML,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{idl}}
    {\lstset{language=IDL,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{corba}}
    {\lstset{language=[CORBA]IDL,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{java}}
    {\lstset{language=Java,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{lisp}}
    {\lstset{language=Lisp,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{make}}
    {\lstset{language=make,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{matlab}}
    {\lstset{language=Matlab,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{pascal}}
    {\lstset{language=Pascal,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{perl}}
    {\lstset{language=Perl,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{php}}
    {\lstset{language=PHP,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{sql}}
    {\lstset{language=SQL,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{latex}}
    {\lstset{language=[LaTeX]TeX,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{plaintex}}
    {\lstset{language=[plain]TeX,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{vhdl}}
    {\lstset{language=VHDL,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{xml}}
    {\lstset{language=XML,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{javascript}}
    {\lstset{language=Java,showstringspaces=false}}{}
  \ifthenelse{\equal{\the\Dipl@DefaultLanguage}{python}}
    {\lstset{language=Python,showstringspaces=false}}{}
}
\lstset%
{
  extendedchars=true,
  basicstyle=\footnotesize\sffamily,
  commentstyle=\sffamily\slshape,
  breaklines=true,
  tabsize=3,
  xleftmargin=3em,
  columns=flexible,
  print=true,
  captionpos=b,
  frame=lines,
  framexleftmargin=3em,
}
\newcommand{\InlCode}[1]{\lstinline[basicstyle=\small\sffamily]$#1$}
\def\appname{P\v{r}\'{\i}lohy}
\renewcommand\appendix{\par
  \setcounter{section}{0}%
  \setcounter{subsection}{0}%
  \gdef\thesection{\@Alph\c@section}
  \addcontentsline{toc}{section}{\appname}%
  }
\newcommand{\InsertFigure}[4]
{
  \begin{figure}
    \centering
    \includegraphics[width=#2]{#1}
    \caption{#3}
    \label{#4}
  \end{figure}
}
\newcommand{\InsertSidewaysFigure}[4]
{
  \begin{sidewaysfigure}
    \centering
    \includegraphics[width=#2]{#1}
    \caption{#3}
    \label{#4}
  \end{sidewaysfigure}
}
\providecommand{\uv}[1]{\leavevmode\quotedblbase#1\textquotedblleft}
\setcounter{tocdepth}{2}
\setcounter{secnumdepth}{5}
\widowpenalty=10000
\clubpenalty=10000
\AtBeginDocument%
{
  \Dipl@SetDefaultLanguage
  \def\appname{P\v{r}\'{\i}lohy}
  \def\refname{Literatura}
}
\endinput
%%
%% End of file `diploma.cls'.
