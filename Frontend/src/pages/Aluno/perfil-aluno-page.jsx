import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '../../services/api'
import { useUser } from '@/contexts/user-context'

export function PerfilPage() {
  const { usuario, setUsuario } = useUser()
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
      setErro('Digite sua senha de login para confirmar a alteração.')
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
      setMensagem('Perfil atualizado com sucesso.')
      setForm((current) => ({ ...current, senhaAtual: '', senhaNova: '' }))
      setEditMode(false)
    } catch (e) {
      setErro(e.message || 'Não foi possível atualizar o perfil.')
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
            Atualize seus dados pessoais com confirmação de senha.
          </p>
        </div>

        <Button variant="outline" onClick={() => setEditMode((current) => !current)}>
          {editMode ? 'Cancelar edição' : 'Editar perfil'}
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
            <Label>Tipo de usuário</Label>
            <Input value={usuario?.tipoUsuario || ''} disabled />
          </div>
        </div>

        {editMode && (
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="senhaAtual">Senha de confirmação</Label>
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
              {salvando ? 'Salvando...' : 'Confirmar alterações'}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
