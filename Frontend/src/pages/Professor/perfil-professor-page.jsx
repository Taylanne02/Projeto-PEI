import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@/contexts/user-context'
import { useProfessorData } from '@/hooks/use-professor-data'
import { api } from '@/services/api'

function BiografiaProfessorForm({ professor, onProfessorUpdated }) {
  const [form, setForm] = useState({
    nome: professor?.nome || '',
    faculdade: professor?.faculdade || '',
    dataNascimento: professor?.dataNascimento || '',
    cidade: professor?.cidade || '',
    biografia: professor?.biografia || '',
  })
  const [editMode, setEditMode] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  function atualizarCampo(campo, valor) {
    setForm((current) => ({ ...current, [campo]: valor }))
  }

  async function salvarBiografia(event) {
    event.preventDefault()
    setErro('')
    setMensagem('')

    if (!form.nome.trim()) {
      setErro('Informe o nome que aparecera na sua biografia.')
      return
    }

    try {
      setSalvando(true)
      const response = await api.updateProfessorBiography(professor.id_professor, form)
      onProfessorUpdated(response.professor)
      setMensagem('Biografia atualizada com sucesso.')
      setEditMode(false)
    } catch (e) {
      setErro(e.message || 'Nao foi possivel atualizar a biografia.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={salvarBiografia} className="mt-6 max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Biografia do professor</h2>
          <p className="mt-1 text-sm text-slate-600">
            Essas informacoes aparecem no seu perfil publico de professor.
          </p>
        </div>

        <Button type="button" variant="outline" onClick={() => setEditMode((current) => !current)}>
          {editMode ? 'Cancelar edicao' : 'Editar biografia'}
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="bio-nome">Nome</Label>
          <Input
            id="bio-nome"
            value={form.nome}
            onChange={(event) => atualizarCampo('nome', event.target.value)}
            disabled={!editMode}
          />
        </div>
        <div>
          <Label htmlFor="faculdade">Faculdade onde se formou</Label>
          <Input
            id="faculdade"
            value={form.faculdade}
            onChange={(event) => atualizarCampo('faculdade', event.target.value)}
            disabled={!editMode}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="dataNascimento">Data de nascimento</Label>
          <Input
            id="dataNascimento"
            type="date"
            value={form.dataNascimento}
            onChange={(event) => atualizarCampo('dataNascimento', event.target.value)}
            disabled={!editMode}
          />
        </div>
        <div>
          <Label htmlFor="cidade">Cidade onde mora</Label>
          <Input
            id="cidade"
            value={form.cidade}
            onChange={(event) => atualizarCampo('cidade', event.target.value)}
            disabled={!editMode}
          />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="biografia">Descricao feita pelo professor</Label>
        <Textarea
          id="biografia"
          value={form.biografia}
          onChange={(event) => atualizarCampo('biografia', event.target.value)}
          disabled={!editMode}
          className="min-h-32 resize-y"
        />
      </div>

      {erro && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {erro}
        </div>
      )}

      {mensagem && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {mensagem}
        </div>
      )}

      {editMode && (
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Confirmar biografia'}
          </Button>
        </div>
      )}
    </form>
  )
}

export function PerfilProfessorPage() {
  const { idProfessor } = useParams()
  const { usuario, setUsuario } = useUser()
  const [professorAtualizado, setProfessorAtualizado] = useState(null)
  const { professor, loading } = useProfessorData(idProfessor, { profile: true })
  const professorPerfil = professorAtualizado || professor
  const [form, setForm] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    cpf: usuario?.cpf || '',
    senhaAtual: '',
    senhaNova: '',
  })
  const [editMode, setEditMode] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  function atualizarCampo(campo, valor) {
    setForm((current) => ({ ...current, [campo]: valor }))
  }

  async function salvarPerfil(event) {
    event.preventDefault()
    setErro('')
    setMensagem('')

    if (!form.senhaAtual) {
      setErro('Digite sua senha de login para confirmar a alteracao.')
      return
    }

    try {
      setSalvando(true)
      const payload = {
        nome: form.nome,
        email: form.email,
        cpf: form.cpf,
        senhaAtual: form.senhaAtual,
      }

      if (form.senhaNova.trim() !== '') {
        payload.senhaNova = form.senhaNova
      }

      const response = await api.updateUserProfile(usuario.id_usuario, payload)
      const usuarioAtualizado = {
        ...usuario,
        ...response.usuario,
      }

      setUsuario(usuarioAtualizado)
      setMensagem('Perfil do professor atualizado com sucesso.')
      setForm((current) => ({ ...current, senhaAtual: '', senhaNova: '' }))
      setEditMode(false)
    } catch (e) {
      setErro(e.message || 'Nao foi possivel atualizar o perfil do professor.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Meu perfil</h1>
          <p className="mt-2 text-slate-600">
            Atualize seus dados de professor com confirmacao de senha.
          </p>
        </div>

        <Button variant="outline" onClick={() => setEditMode((current) => !current)}>
          {editMode ? 'Cancelar edicao' : 'Editar perfil'}
        </Button>
      </div>

      <form onSubmit={salvarPerfil} className="mt-8 max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={form.nome}
              onChange={(event) => atualizarCampo('nome', event.target.value)}
              disabled={!editMode}
            />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => atualizarCampo('email', event.target.value)}
              disabled={!editMode}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={form.cpf}
              onChange={(event) => atualizarCampo('cpf', event.target.value)}
              disabled={!editMode}
            />
          </div>
          <div>
            <Label>Tipo de usuario</Label>
            <Input value={usuario?.tipoUsuario || ''} disabled />
          </div>
        </div>

        {editMode && (
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="senhaAtual">Senha de confirmacao</Label>
              <Input
                id="senhaAtual"
                type="password"
                value={form.senhaAtual}
                onChange={(event) => atualizarCampo('senhaAtual', event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="senhaNova">Nova senha (opcional)</Label>
              <Input
                id="senhaNova"
                type="password"
                value={form.senhaNova}
                onChange={(event) => atualizarCampo('senhaNova', event.target.value)}
              />
            </div>
          </div>
        )}

        {erro && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {mensagem}
          </div>
        )}

        {editMode && (
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Confirmar alteracoes'}
            </Button>
          </div>
        )}
      </form>

      {loading && (
        <div className="mt-6 max-w-2xl rounded-xl border bg-white p-6 text-sm text-slate-600 shadow-sm">
          Carregando biografia...
        </div>
      )}

      {!loading && professorPerfil && (
        <BiografiaProfessorForm
          key={`${professorPerfil.id_professor}-${professorPerfil.nome}-${professorPerfil.faculdade}-${professorPerfil.dataNascimento}-${professorPerfil.cidade}-${professorPerfil.biografia}`}
          professor={professorPerfil}
          onProfessorUpdated={(updatedProfessor) => {
            setProfessorAtualizado(updatedProfessor)
            setUsuario((current) => ({ ...current, nome: updatedProfessor.nome }))
          }}
        />
      )}
    </div>
  )
}
